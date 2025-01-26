export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  action_type?: 'navigate' | 'mark_read';
  action_path?: string;
  action_tab?: string;
  user_id: string;
}