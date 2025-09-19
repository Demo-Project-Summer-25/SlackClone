// frontend/src/components/ProfilePage.tsx
import { useEffect, useState } from "react";
import { 
  X, Edit, Phone, Mail, MapPin, Clock, LogOut 
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
        phone: currentUser.phone || "+1 (555) 123-4567",
        location: "Wilmington, Delaware",
        timezone: "EST",
        bio: "Hire me!",
        pronouns: "she/her"
      });
    }
  }, [currentUser]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!currentUser) return <div className="p-4">No profile found</div>;

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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profile.displayName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-background ${getStatusColor(userStatus)}`} />
                </div>
                
                <div className="flex-1 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profile.displayName}
                          onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={profile.title}
                          onChange={(e) => setProfile({...profile, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pronouns">Pronouns</Label>
                        <Input
                          id="pronouns"
                          value={profile.pronouns}
                          onChange={(e) => setProfile({...profile, pronouns: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-2xl font-medium">{profile.displayName}</h2>
                        <p className="text-muted-foreground">{profile.title}</p>
                        {profile.pronouns && (
                          <p className="text-sm text-muted-foreground">({profile.pronouns})</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm capitalize">{userStatus}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
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
                      <div className="mt-2">
                        <Badge
                          variant={currentUser.accountStatus === "ACTIVE" ? "default" : "destructive"}
                        >
                          {currentUser.accountStatus}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Member since {new Date(currentUser.createdTimestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{profile.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={profile.timezone}
                      onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{profile.email}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{profile.phone}</p>
                      <p className="text-xs text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{profile.location}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{profile.timezone}</p>
                      <p className="text-xs text-muted-foreground">Timezone</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sign Out */}
          {!isEditing && (
            <Card className="border-destructive/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Sign Out</p>
                      <p className="text-xs text-muted-foreground">
                        Log out of your Ping account
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
