import path from 'path';
import fs from 'fs';
import { app } from 'electron';

// 创建一个简单的存储类
export default class SimpleStore {
  constructor( filename = 'app-config.json') {
    // 设置用户数据目录，确保有写入权限, 必须在app ready之前调用
    app.setPath('userData', path.join(app.getPath('appData'), 'SimpleClock'));
    app.setPath('userCache', path.join(app.getPath('userData'), 'Cache'));
    // 获取用户数据目录
    this.storeDir = app.getPath('userData');
    // 构建存储文件的路径
    this.storePath = path.join(this.storeDir, filename);
    this.data = this.load();
  }

  load() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.storeDir)) {
        fs.mkdirSync(this.storeDir, { recursive: true });
      }
      
      // 读取文件
      if (fs.existsSync(this.storePath)) {
        const content = fs.readFileSync(this.storePath, 'utf8');
        return JSON.parse(content);
      }
      
      // 文件不存在，返回空对象
      return {};
    } catch (error) {
      console.error('Failed to load store:', error);
      return {};
    }
  }

  save() {
    try {
      const content = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(this.storePath, content, 'utf8');
      return true;
    } catch (error) {
      console.error('Failed to save store:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this.data;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  getAll() {
    return JSON.parse(JSON.stringify(this.data)); // 返回深拷贝，防止外部修改
  }

  set(key, value) {
    const keys = key.split('.');
    let current = this.data;
    
    // 遍历到倒数第二层
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k] || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }
    
    // 设置最终值
    current[keys[keys.length - 1]] = value;
    
    return this.save();
  }

  delete(key) {
    const keys = key.split('.');
    let current = this.data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k] || typeof current[k] !== 'object') {
        return false; // 路径不存在
      }
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    if (current.hasOwnProperty(lastKey)) {
      delete current[lastKey];
      return this.save();
    }
    
    return false;
  }

  clear() {
    this.data = {};
    return this.save();
  }

  has(key) {
    return this.get(key) !== undefined;
  }
}