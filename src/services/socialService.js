import { SOCIAL_CONFIG, FEATURES } from '../config';
import loggerService from './loggerService';
import analyticsService from './analyticsService';

class SocialService {
  constructor() {
    this.enabled = FEATURES.enableSocialSharing;
    this.facebookAppId = SOCIAL_CONFIG.facebook.appId;
    this.twitterApiKey = SOCIAL_CONFIG.twitter.apiKey;
    this.initialized = false;
  }

  initialize() {
    if (!this.enabled || this.initialized) return;

    try {
      // Initialize Facebook SDK
      if (this.facebookAppId) {
        this.loadFacebookSDK();
      }

      // Initialize Twitter SDK
      if (this.twitterApiKey) {
        this.loadTwitterSDK();
      }

      this.initialized = true;
    } catch (error) {
      loggerService.error('Failed to initialize social services', error);
    }
  }

  loadFacebookSDK() {
    // Load Facebook SDK
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://connect.facebook.net/en_US/sdk.js`;
    document.head.appendChild(script);

    // Initialize Facebook SDK
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: this.facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };
  }

  loadTwitterSDK() {
    // Load Twitter SDK
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    document.head.appendChild(script);
  }

  async shareOnFacebook(url, title, description, image) {
    if (!this.enabled) return;

    try {
      const shareData = {
        method: 'share',
        href: url,
        quote: `${title}\n\n${description}`
      };

      if (window.FB) {
        window.FB.ui(shareData);
        this.trackShare('facebook', url);
      } else {
        // Fallback to URL sharing
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    } catch (error) {
      loggerService.error('Failed to share on Facebook', error);
    }
  }

  async shareOnTwitter(url, title, hashtags = []) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags.join(','))}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
      this.trackShare('twitter', url);
    } catch (error) {
      loggerService.error('Failed to share on Twitter', error);
    }
  }

  async shareOnLinkedIn(url, title, description) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
      this.trackShare('linkedin', url);
    } catch (error) {
      loggerService.error('Failed to share on LinkedIn', error);
    }
  }

  async shareOnWhatsApp(url, title) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
      window.open(shareUrl, '_blank');
      this.trackShare('whatsapp', url);
    } catch (error) {
      loggerService.error('Failed to share on WhatsApp', error);
    }
  }

  async shareOnEmail(url, title, description) {
    if (!this.enabled) return;

    try {
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(`${description}\n\n${url}`);
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
      this.trackShare('email', url);
    } catch (error) {
      loggerService.error('Failed to share via email', error);
    }
  }

  async shareOnReddit(url, title) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
      this.trackShare('reddit', url);
    } catch (error) {
      loggerService.error('Failed to share on Reddit', error);
    }
  }

  async shareOnPinterest(url, title, image) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
      this.trackShare('pinterest', url);
    } catch (error) {
      loggerService.error('Failed to share on Pinterest', error);
    }
  }

  async shareOnTelegram(url, title) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank');
      this.trackShare('telegram', url);
    } catch (error) {
      loggerService.error('Failed to share on Telegram', error);
    }
  }

  async shareOnTumblr(url, title, description) {
    if (!this.enabled) return;

    try {
      const shareUrl = `https://www.tumblr.com/share/link?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
      this.trackShare('tumblr', url);
    } catch (error) {
      loggerService.error('Failed to share on Tumblr', error);
    }
  }

  trackShare(platform, url) {
    analyticsService.trackEvent('social_share', platform, url);
    loggerService.info('Social Share', { platform, url });
  }

  async getFacebookLoginStatus() {
    if (!this.enabled || !window.FB) return null;

    try {
      return new Promise((resolve) => {
        window.FB.getLoginStatus((response) => {
          resolve(response);
        });
      });
    } catch (error) {
      loggerService.error('Failed to get Facebook login status', error);
      return null;
    }
  }

  async loginWithFacebook() {
    if (!this.enabled || !window.FB) return null;

    try {
      return new Promise((resolve, reject) => {
        window.FB.login((response) => {
          if (response.authResponse) {
            resolve(response.authResponse);
          } else {
            reject(new Error('Facebook login failed'));
          }
        }, { scope: 'email,public_profile' });
      });
    } catch (error) {
      loggerService.error('Failed to login with Facebook', error);
      return null;
    }
  }

  async logoutFromFacebook() {
    if (!this.enabled || !window.FB) return;

    try {
      return new Promise((resolve) => {
        window.FB.logout((response) => {
          resolve(response);
        });
      });
    } catch (error) {
      loggerService.error('Failed to logout from Facebook', error);
    }
  }

  async getFacebookUserProfile() {
    if (!this.enabled || !window.FB) return null;

    try {
      return new Promise((resolve, reject) => {
        window.FB.api('/me', { fields: 'id,name,email,picture' }, (response) => {
          if (response && !response.error) {
            resolve(response);
          } else {
            reject(new Error('Failed to get Facebook profile'));
          }
        });
      });
    } catch (error) {
      loggerService.error('Failed to get Facebook user profile', error);
      return null;
    }
  }
}

// Create a singleton instance
const socialService = new SocialService();

export default socialService; 