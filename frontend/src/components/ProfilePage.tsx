import { useEffect, useState } from "react";
import { 
  ArrowLeft, Edit, Phone, Mail, MapPin, Clock, LogOut 
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuth } from "../hooks/useAuth";

interface ProfilePageProps {
  onClose: () => void;
}

export function ProfilePage({ onClose }: ProfilePageProps) {
  const { currentUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "offline">("online");

  // Local editable state
  const [profile, setProfile] = useState({
    displayName: "",
    title: "Junior Software Developer",
    email: "",
    phone: "",
    location: "Wilmington, Delaware",
    timezone: "EST",
    bio: "Hire me!",
    pronouns: "she/her"
  });

  // Sync with currentUser when loaded
  useEffect(() => {
    if (currentUser) {
      setProfile({
        displayName: currentUser.displayName || currentUser.username,
        title: "Junior Software Developer",
        email: currentUser.email || "user@example.com",
        phone: "+1 (555) 123-4567", // Default value since phone is not in User type
        location: "Wilmington, Delaware",
        timezone: "EST",
        bio: "Hire me!",
        pronouns: "she/her"
      });
    }
  }, [currentUser]);

  if (isLoading) return <div className="p-3 sm:p-4">Loading...</div>;
  if (!currentUser) return <div className="p-3 sm:p-4">No profile found</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // 🚀 TODO: send profile updates to backend
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      {/* ✅ Header - simplified without flex positioning */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium">Profile Details</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden text-xs">Cancel</span>
              </Button>
              <Button size="sm" onClick={handleSave}>
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden text-xs">Save</span>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      {/* ✅ Content - scrollable flexible area */}
      <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
        
        {/* ✅ All existing card content stays exactly the same */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                  <AvatarFallback className="text-lg sm:text-xl lg:text-2xl bg-primary text-primary-foreground">
                    {profile.displayName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 sm:border-4 border-background ${getStatusColor(userStatus)}`} />
              </div>
              
              <div className="flex-1 space-y-3 min-w-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="displayName" className="text-sm">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile.displayName}
                        onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title" className="text-sm">Title</Label>
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pronouns" className="text-sm">Pronouns</Label>
                      <Input
                        id="pronouns"
                        value={profile.pronouns}
                        onChange={(e) => setProfile({...profile, pronouns: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-medium truncate">{profile.displayName}</h2>
                      <p className="text-sm sm:text-base text-muted-foreground truncate">{profile.title}</p>
                      {profile.pronouns && (
                        <p className="text-xs sm:text-sm text-muted-foreground">({profile.pronouns})</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm capitalize">{userStatus}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs self-start sm:self-auto"
                        onClick={() => {
                          const statuses: ("online" | "away" | "offline")[] = ["online", "away", "offline"];
                          const currentIndex = statuses.indexOf(userStatus);
                          const nextIndex = (currentIndex + 1) % statuses.length;
                          setUserStatus(statuses[nextIndex]);
                        }}
                      >
                        Change Status
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Badge
                        variant={currentUser.accountStatus === "ACTIVE" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {currentUser.accountStatus}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Member since {new Date(currentUser.createdTimestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ Responsive About Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <div>
                <Label htmlFor="bio" className="text-sm">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="min-h-[80px] text-sm"
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{profile.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* ✅ Responsive Contact Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                    className="text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{profile.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{profile.phone}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{profile.location}</p>
                    <p className="text-xs text-muted-foreground">Location</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{profile.timezone}</p>
                    <p className="text-xs text-muted-foreground">Timezone</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ✅ Responsive Sign Out */}
        {!isEditing && (
          <Card className="border-destructive/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Sign Out</p>
                    <p className="text-xs text-muted-foreground">
                      Log out of your Ping account
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" className="flex-shrink-0">
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}