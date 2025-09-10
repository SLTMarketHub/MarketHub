import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Upload, 
  X, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

// Form validation schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  onSuccess: (message: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onSuccess }) => {
  const { profile, updateProfile, updateAvatar } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      dateOfBirth: profile?.dateOfBirth || '',
      gender: profile?.gender || 'prefer-not-to-say',
    },
  });

  // Reset form when profile data changes
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || 'prefer-not-to-say',
      });
    }
  }, [profile, reset]);

  // Set avatar preview
  useEffect(() => {
    if (profile?.avatar) {
      setAvatarPreview(profile.avatar);
    }
  }, [profile]);

  // Handle profile form submission
  const onSubmit = async (data: ProfileFormData) => {
    const success = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as any,
    });
    
    if (success) {
      onSuccess('Profile updated successfully');
      setIsEditing(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload avatar
    const success = await updateAvatar(file);
    if (success) {
      onSuccess('Profile picture updated successfully');
    }
  };

  if (!profile) return null;

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your account's profile information and email address.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personal Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your personal information and profile picture.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Profile Picture
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="relative group">
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src={avatarPreview || '/default-avatar.png'}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer p-2 bg-white bg-opacity-80 rounded-full">
                          <Upload className="h-5 w-5 text-gray-700" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">
                        Click on the image to change your profile picture
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Recommended size: 200x200px, max 2MB
                      </p>
                    </div>
                  )}
                </div>
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Name
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex-1 space-y-2">
                    <div>
                      <input
                        type="text"
                        {...register('firstName')}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.firstName ? 'border-red-300' : ''
                        }`}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        {...register('lastName')}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.lastName ? 'border-red-300' : ''
                        }`}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="flex-1">
                    {profile.firstName} {profile.lastName}
                  </span>
                )}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                Email
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="email"
                      {...register('email')}
                      disabled={!isEditing}
                      readOnly
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email address
                    </p>
                  </div>
                ) : (
                  <span className="flex-1">{profile.email}</span>
                )}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                Phone
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="tel"
                      {...register('phone')}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.phone ? 'border-red-300' : ''
                      }`}
                      placeholder="Phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="flex-1">{profile.phone || 'Not provided'}</span>
                )}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                Date of Birth
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="date"
                      {...register('dateOfBirth')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                ) : (
                  <span className="flex-1">
                    {profile.dateOfBirth 
                      ? new Date(profile.dateOfBirth).toLocaleDateString() 
                      : 'Not provided'}
                  </span>
                )}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Gender
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex-1">
                    <select
                      {...register('gender')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="prefer-not-to-say">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                ) : (
                  <span className="flex-1 capitalize">
                    {profile.gender?.replace(/-/g, ' ') || 'Not specified'}
                  </span>
                )}
              </dd>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
