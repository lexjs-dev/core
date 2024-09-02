import fs from 'node:fs';
import type { FileTree } from '../types/file-structure.types.js';

export function createFiles<T extends FileTree<true>>(fileTree: T): void {
  Object.values(fileTree).forEach((file) => {
    if (file.type === 'file') {
      fs.writeFileSync(
        file.path,
        (file.data instanceof Function ? file.data() : file.data) ?? '',
      );
      return;
    }

    if (!fs.existsSync(file.path)) {
      fs.mkdirSync(file.path);
    }

    if (file.children != null && Object.keys(file.children).length > 0) {
      createFiles(file.children);
    }
  });
}
