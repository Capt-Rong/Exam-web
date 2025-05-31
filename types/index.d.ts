export interface SubjectCardProps {
  subjectName: string;
  description: string; // Added description to match reference image more closely
  bgColorClass: string; // e.g., 'bg-green-200'
  textColorClass: string; // e.g., 'text-green-800'
  buttonColorClass: string; // e.g., 'bg-green-600 hover:bg-green-700'
  href: string; // Link for the card
}
