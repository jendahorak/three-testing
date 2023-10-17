import { defineConfig } from 'vite';
import path, { resolve } from 'path';

// Get the current working directory (where Vite is executed)
const currentDirectory = process.cwd();

// Extract the project name from the folder name
const projectName = path.basename(currentDirectory);

export default defineConfig({
  base: `/${projectName}/`,
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        main: resolve(__dirname, 'src/pages/main/index.html'),
        materials: resolve(__dirname, 'src/pages/materials/index.html'),
        sgraph: resolve(__dirname, 'src/pages/scene-graph/index.html'),
        cameras: resolve(__dirname, 'src/pages/cameras/index.html'),
      },
    },
  },
});
