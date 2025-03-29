
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

interface ProfileHeaderProps {
  user: User | null;
  fullName: string;
}

export const ProfileHeader = ({ user, fullName }: ProfileHeaderProps) => {
  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "U";

  return (
    <Avatar className="h-24 w-24">
      <AvatarImage src={user?.user_metadata?.avatar_url} alt={fullName || user?.email} />
      <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
    </Avatar>
  );
};
