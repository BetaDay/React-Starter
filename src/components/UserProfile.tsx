import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileData {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  user_type?: string;
}

const UserProfile = () => {
  const { user, signOut, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, user_type")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleSignOut = () => {
    signOut();           // Clears session
    navigate("/");       // Redirects to homepage
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white"
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : user.email?.[0].toUpperCase() || "U";

  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : user.email?.split("@")[0] || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-orange-500 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-gray-500 capitalize">
              {profile?.user_type || "user"}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center w-full">
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center w-full">
            <Heart className="h-4 w-4 mr-2" />
            Saved Properties
          </Link>
        </DropdownMenuItem>

        {profile?.user_type === "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center w-full">
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center w-full text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
