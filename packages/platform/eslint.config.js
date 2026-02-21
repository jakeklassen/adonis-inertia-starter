import { configApp } from '@adonisjs/eslint-config';
import depend from 'eslint-plugin-depend';

export default [...configApp(), depend.configs['flat/recommended']];
