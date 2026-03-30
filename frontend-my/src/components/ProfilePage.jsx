import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reviewService from '../services/reviewService';
import './ProfilePage.css';

function ProfilePage({ user, userStats, onRefresh }) {
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    dob: '',
    website: ''
  });
  const [originalProfile, setOriginalProfile] = useState({});

  // Load user profile data from localStorage or default
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setOriginalProfile(parsed);
    } else {
      const defaultProfile = {
        username: user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        phone: '',
        location: '',
        bio: '',
        dob: '',
        website: ''
      };
      setProfileData(defaultProfile);
      setOriginalProfile(defaultProfile);
    }
  }, [user]);

  useEffect(() => {
    loadMyReviews();
  }, [page]);

  const loadMyReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getMyReviews(user.id, page, 5);
      setMyReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVote = async (reviewId, type) => {
    try {
      if (type === 'upvote') {
        await reviewService.upvote(reviewId);
      } else {
        await reviewService.downvote(reviewId);
      }
      await loadMyReviews();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setOriginalProfile(profileData);
    setIsEditing(false);
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'profile-save-success';
    successMsg.textContent = '✅ Profile updated successfully!';
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
  };

  const handleCancelEdit = () => {
    setProfileData(originalProfile);
    setIsEditing(false);
  };

  const getMemberSince = () => {
    if (userStats?.memberSince) return formatDate(userStats.memberSince);
    if (user?.createdAt) return formatDate(user.createdAt);
    return 'Recent';
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  };

  if (loading && myReviews.length === 0) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const age = calculateAge(profileData.dob);

  return (
    <div className="profile-page">
      {/* Profile Header with Cover */}
      <div className="profile-cover">
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            <span className="avatar-emoji-large">
              {profileData.username?.charAt(0)?.toUpperCase() || '👤'}
            </span>
          </div>
          <div className="profile-info-large">
            <div className="profile-name-section">
              <h1>{profileData.username || user?.email?.split('@')[0]}</h1>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                  ✏️ Edit Profile
                </button>
              )}
            </div>
            <p className="profile-email">📧 {user?.email}</p>
            <p className="member-since">
              🗓️ Member since: {getMemberSince()}
            </p>
            <Link to="/" className="back-btn">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal/Section */}
      {isEditing && (
        <div className="edit-profile-modal">
          <div className="edit-profile-content">
            <h3>Edit Profile Information</h3>
            <div className="edit-profile-form">
              <div className="edit-form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  placeholder="Your display name"
                />
              </div>
              <div className="edit-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              <div className="edit-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="edit-form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
              <div className="edit-form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={profileData.dob}
                  onChange={handleInputChange}
                />
                {age && <small>{age} years old</small>}
              </div>
              <div className="edit-form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="edit-form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>
              <div className="edit-form-actions">
                <button onClick={handleSaveProfile} className="save-btn">Save Changes</button>
                <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-value">{userStats?.totalReviews || 0}</div>
          <div className="profile-stat-label">Total Reviews</div>
        </div>
        <div className="profile-stat-card upvote">
          <div className="profile-stat-value">👍 {userStats?.totalUpvotes || 0}</div>
          <div className="profile-stat-label">Upvotes Received</div>
        </div>
        <div className="profile-stat-card downvote">
          <div className="profile-stat-value">👎 {userStats?.totalDownvotes || 0}</div>
          <div className="profile-stat-label">Downvotes Received</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-value">{userStats?.totalReviews || 0}</div>
          <div className="profile-stat-label">Reviews Written</div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="profile-info-section">
        <h2>📋 Personal Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value">{profileData.username || 'Not set'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{profileData.phone || 'Not set'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{profileData.location || 'Not set'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">{getMemberSince()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth</span>
            <span className="info-value">
              {profileData.dob ? `${formatDateShort(profileData.dob)}${age ? ` (${age} years)` : ''}` : 'Not set'}
            </span>
          </div>
          <div className="info-item full-width">
            <span className="info-label">Bio</span>
            <span className="info-value bio-text">{profileData.bio || 'No bio added yet.'}</span>
          </div>
          {profileData.website && (
            <div className="info-item full-width">
              <span className="info-label">Website</span>
              <span className="info-value">
                <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* My Reviews Section */}
      <div className="profile-reviews-section">
        <h2>📝 My Reviews</h2>
        
        {myReviews.length === 0 ? (
          <div className="profile-no-reviews">
            <p>You haven't posted any reviews yet.</p>
            <Link to="/" className="write-review-link">Write your first review →</Link>
          </div>
        ) : (
          <>
            <div className="profile-reviews-list">
              {myReviews.map(review => (
                <div key={review.id} className="profile-review-card">
                  <div className="profile-review-header">
                    <h3>{review.productName}</h3>
                    <span className="profile-category-badge">{review.category}</span>
                  </div>
                  <div className="profile-review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="profile-review-text">"{review.reviewText}"</p>
                  <div className="profile-review-footer">
                    <div className="profile-review-stats">
                      <button 
                        onClick={() => handleVote(review.id, 'upvote')}
                        className="profile-vote-btn upvote"
                      >
                        👍 {review.upvotes}
                      </button>
                      <button 
                        onClick={() => handleVote(review.id, 'downvote')}
                        className="profile-vote-btn downvote"
                      >
                        👎 {review.downvotes}
                      </button>
                    </div>
                    <div className="profile-review-date">
                      📅 {formatDateShort(review.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="profile-pagination">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  ← Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
