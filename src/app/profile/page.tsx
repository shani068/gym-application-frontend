import { withAuth } from "@/components/HOC/with-auth";
import ProfileEditForm from "./ProfileEditForm";



function ProfileEditPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <ProfileEditForm />
    </div>
  )
}

export default withAuth(ProfileEditPage);