import fs from 'fs';
import path from 'path';

export const BASE_DIR = path.join(process.cwd(), 'data'); // Carpeta no pública

// Obtener estructura de carpetas y archivos
export function getFolderStructure(dir: string = '') {
  // Si dir está vacío, usamos BASE_DIR directamente
  const fullPath = dir ? path.join(BASE_DIR, dir) : BASE_DIR;
  
  try {
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    return items.map((item) => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      // Si estamos en la raíz, el path será solo el nombre del item
      // Si no, concatenamos el dir actual con el nombre del item
      path: dir ? path.join(dir, item.name).replace(/\\/g, '/') : item.name,
    }));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

// Leer contenido de un archivo
export function getFileContent(filePath: string) {
  try {
    const absolutePath = path.join(BASE_DIR, filePath);
    
    // Verificar que el archivo existe y está dentro de BASE_DIR
    const normalizedPath = path.normalize(absolutePath);
    if (!normalizedPath.startsWith(BASE_DIR)) {
      throw new Error('Invalid file path');
    }
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error('File not found');
    }
    
    return fs.readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

// Guardar cambios en un archivo
export function saveFileContent(filePath: string, content: string) {
  const absolutePath = path.join(BASE_DIR, filePath);
  fs.writeFileSync(absolutePath, content, 'utf-8');
}