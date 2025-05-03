import { MINIO_CONFIG, APP_CONFIG } from '../config';
import axios from 'axios';

class StorageService {
  constructor() {
    this.endpoint = MINIO_CONFIG.endpoint;
    this.accessKey = MINIO_CONFIG.accessKey;
    this.secretKey = MINIO_CONFIG.secretKey;
    this.useSSL = MINIO_CONFIG.useSSL;
  }

  async uploadFile(file, bucket = 'default', path = '') {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (file.size > APP_CONFIG.maxFileSize) {
        throw new Error('File size exceeds limit');
      }

      if (!APP_CONFIG.supportedImageTypes.includes(file.type)) {
        throw new Error('Unsupported file type');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('path', path);

      // Upload file
      const response = await axios.post(`${this.endpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  }

  async deleteFile(fileUrl) {
    try {
      await axios.delete(`${this.endpoint}/files`, {
        data: { fileUrl },
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
  }

  async getFileUrl(filePath, bucket = 'default', expiresIn = 3600) {
    try {
      const response = await axios.get(`${this.endpoint}/presigned-url`, {
        params: {
          filePath,
          bucket,
          expiresIn
        },
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return response.data.url;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get file URL');
    }
  }

  async listFiles(bucket = 'default', prefix = '', recursive = true) {
    try {
      const response = await axios.get(`${this.endpoint}/files`, {
        params: {
          bucket,
          prefix,
          recursive
        },
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to list files');
    }
  }

  async createBucket(bucketName) {
    try {
      await axios.post(`${this.endpoint}/buckets`, {
        bucket: bucketName
      }, {
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create bucket');
    }
  }

  async deleteBucket(bucketName) {
    try {
      await axios.delete(`${this.endpoint}/buckets/${bucketName}`, {
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete bucket');
    }
  }

  async getBucketPolicy(bucketName) {
    try {
      const response = await axios.get(`${this.endpoint}/buckets/${bucketName}/policy`, {
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get bucket policy');
    }
  }

  async setBucketPolicy(bucketName, policy) {
    try {
      await axios.put(`${this.endpoint}/buckets/${bucketName}/policy`, {
        policy
      }, {
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to set bucket policy');
    }
  }

  async getFileMetadata(filePath, bucket = 'default') {
    try {
      const response = await axios.get(`${this.endpoint}/files/metadata`, {
        params: {
          filePath,
          bucket
        },
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get file metadata');
    }
  }

  async copyFile(sourcePath, destinationPath, sourceBucket = 'default', destinationBucket = 'default') {
    try {
      await axios.post(`${this.endpoint}/files/copy`, {
        sourcePath,
        destinationPath,
        sourceBucket,
        destinationBucket
      }, {
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to copy file');
    }
  }

  async moveFile(sourcePath, destinationPath, sourceBucket = 'default', destinationBucket = 'default') {
    try {
      await axios.post(`${this.endpoint}/files/move`, {
        sourcePath,
        destinationPath,
        sourceBucket,
        destinationBucket
      }, {
        headers: {
          'X-Access-Key': this.accessKey,
          'X-Secret-Key': this.secretKey
        }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to move file');
    }
  }
}

// Create a singleton instance
const storageService = new StorageService();

export default storageService; 