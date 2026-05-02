

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}


export interface ConversationListItem {
  _id: string;

  participants: PopulatedUser[];
  lastMessage: any | null;
  unreadCount: number;

}