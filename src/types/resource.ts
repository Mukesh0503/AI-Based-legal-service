
export interface LegalResource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'faq' | 'template';
  content: string;
  author?: string;
  createdAt: string;
  tags: string[];
  language: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}
