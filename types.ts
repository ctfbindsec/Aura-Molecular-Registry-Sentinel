
export type ViewType = 'chat' | 'image' | 'deep_analysis' | 'web_query';

export interface Message {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}
