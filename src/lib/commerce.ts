// Mock commerce for development without API
// This allows you to work on the design and functionality without needing API keys
import { mockCommerce } from "./mock-commerce";

export const commerce = mockCommerce as any;
export default commerce;
