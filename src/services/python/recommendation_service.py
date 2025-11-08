
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta

class RecommendationEngine:
    def __init__(self):
        # Initial state
        self.providers = []
        self.clusters = None
        self.scaler = StandardScaler()
        self.cluster_centroids = None
        self.n_clusters = 4  # Default number of clusters
        self.user_interactions = {}  # Track user interactions for personalization
        self.booking_history = {}    # Track booking history

    def load_providers(self, providers_data: List[Dict[str, Any]]):
        """Load provider data for clustering and scoring"""
        self.providers = providers_data
        
    def extract_features(self, providers=None):
        """Extract numerical features for clustering"""
        if providers is None:
            providers = self.providers
            
        features = []
        for provider in providers:
            # Extract and normalize features
            # Convert categorical to numerical using simple encoding
            category_code = hash(provider.get('category', '')) % 10
            district_code = hash(provider.get('district', '')) % 10
            
            features.append([
                provider.get('rating', 3.0),
                provider.get('experience', 1),
                category_code,
                district_code,
                1 if provider.get('verified', False) else 0,
                provider.get('responseTime', 24)
            ])
            
        return np.array(features)
        
    def cluster_providers(self):
        """Perform K-means clustering on providers"""
        if not self.providers:
            return None
            
        # Extract features
        features = self.extract_features()
        
        # Scale features
        scaled_features = self.scaler.fit_transform(features)
        
        # Perform clustering
        kmeans = KMeans(n_clusters=self.n_clusters, random_state=42)
        clusters = kmeans.fit_predict(scaled_features)
        
        # Store cluster centroids
        self.cluster_centroids = kmeans.cluster_centers_
        
        # Assign clusters to providers
        for i, provider in enumerate(self.providers):
            provider['cluster'] = int(clusters[i])
            
        return clusters
        
    def calculate_score(self, provider, user_preferences=None, user_id=None):
        """Calculate AI score based on multiple factors and personalization"""
        base_score = 0.0
        
        # Base score from rating (0-5 scale)
        rating = provider.get('rating', 3.0)
        base_score += rating * 0.4
        
        # Verification status
        if provider.get('verified', False):
            base_score += 1.0 * 0.3
            
        # Category match with user preference
        category_match = 0.5  # Default partial match
        if user_preferences and user_preferences.get('category'):
            if provider.get('category') == user_preferences.get('category'):
                category_match = 1.0
        base_score += category_match * 0.2
        
        # Proximity score
        proximity_score = 0.8  # Default reasonable distance
        if user_preferences and user_preferences.get('distance'):
            distance = provider.get('distance', 0)
            max_distance = user_preferences.get('distance', 60)
            if distance <= 10:
                proximity_score = 1.0
            elif distance <= 20:
                proximity_score = 0.8
            elif distance <= 40:
                proximity_score = 0.5
            elif distance <= 60:
                proximity_score = 0.2
            else:
                proximity_score = 0.0
        base_score += proximity_score * 0.1
        
        # Apply personalization if user_id provided
        if user_id and user_id in self.user_interactions:
            # Get user's interaction history
            interactions = self.user_interactions[user_id]
            
            # Boost for category preference based on past interactions
            if provider.get('category') in interactions.get('category_preferences', {}):
                category_boost = interactions['category_preferences'][provider.get('category')] * 0.1
                base_score += category_boost
                
            # Boost for district preference
            if provider.get('district') in interactions.get('district_preferences', {}):
                district_boost = interactions['district_preferences'][provider.get('district')] * 0.05
                base_score += district_boost
        
        # Adjust with reinforcement learning reward (stored externally)
        rl_reward = provider.get('rl_reward', 0.0)
        base_score += rl_reward
        
        # Availability boost - providers with more available slots get slight boost
        available_slots = provider.get('availableSlots', 0)
        if available_slots > 0:
            availability_boost = min(available_slots / 10, 0.2)  # Cap at 0.2
            base_score += availability_boost
            
        # Round to one decimal place
        return round(base_score, 1)
        
    def get_recommendations(self, user_preferences=None, user_id=None, limit=20):
        """Get recommendations based on preferences, clustering and personalization"""
        if not self.providers:
            return []
            
        # If we haven't clustered yet, do it now
        if not self.cluster_centroids is not None:
            self.cluster_providers()
            
        # Score all providers
        for provider in self.providers:
            provider['score'] = self.calculate_score(provider, user_preferences, user_id)
            
        # Apply fuzzy logic for badges
        for provider in self.providers:
            badges = []
            
            if provider['score'] > 4.5:
                badges.append("Highly Recommended")
                
            if provider.get('responseTime', 0) < 5:
                badges.append("Fast & Trusted")
                
            if provider.get('rating', 5) < 3.5 or provider.get('experience', 10) < 1:
                badges.append("New Provider")
                
            if provider.get('verified', False) and provider.get('experience', 0) > 10:
                badges.append("Trusted Advisor")
                
            # Add availability badge
            if provider.get('availableSlots', 0) > 5:
                badges.append("High Availability")
                
            # Add popular badge based on booking history
            provider_id = provider.get('id')
            if provider_id in self.booking_history and self.booking_history[provider_id] > 10:
                badges.append("Popular Choice")
                
            provider['badges'] = badges
            
        # Filter if needed
        filtered_providers = self.providers
        if user_preferences:
            filtered_providers = filtered_providers.copy()
            
            # Filter by category
            if user_preferences.get('category'):
                filtered_providers = [p for p in filtered_providers 
                                    if p.get('category') == user_preferences.get('category')]
                                    
            # Filter by district
            if user_preferences.get('district'):
                filtered_providers = [p for p in filtered_providers 
                                   if p.get('district') == user_preferences.get('district')]
                                   
            # Filter by minimum rating
            if user_preferences.get('minRating', 0) > 0:
                filtered_providers = [p for p in filtered_providers 
                                   if p.get('rating', 0) >= user_preferences.get('minRating')]
                                   
            # Filter by minimum experience
            if user_preferences.get('minExperience', 0) > 0:
                filtered_providers = [p for p in filtered_providers 
                                   if p.get('experience', 0) >= user_preferences.get('minExperience')]
                                   
            # Apply distance filter if location is provided
            if user_preferences.get('distance') and user_preferences.get('district'):
                max_distance = user_preferences.get('distance', 60)
                filtered_providers = [p for p in filtered_providers if p.get('distance', 0) <= max_distance]
            
        # Sort by score (highest first)
        sorted_providers = sorted(filtered_providers, key=lambda x: x.get('score', 0), reverse=True)
        
        # Return limited number
        return sorted_providers[:limit]

    def add_user_interaction(self, user_id, interaction_type, interaction_data):
        """Track user interactions for personalized recommendations"""
        if user_id not in self.user_interactions:
            self.user_interactions[user_id] = {
                'category_preferences': {},
                'district_preferences': {},
                'viewed_providers': [],
                'interaction_history': []
            }
            
        # Add new interaction to history
        self.user_interactions[user_id]['interaction_history'].append({
            'type': interaction_type,
            'data': interaction_data,
            'timestamp': datetime.now().isoformat()
        })
        
        # Update category preferences
        if interaction_type == 'view_provider' and 'category' in interaction_data:
            category = interaction_data['category']
            if category not in self.user_interactions[user_id]['category_preferences']:
                self.user_interactions[user_id]['category_preferences'][category] = 0
            self.user_interactions[user_id]['category_preferences'][category] += 0.1
            
        # Update district preferences
        if interaction_type == 'view_provider' and 'district' in interaction_data:
            district = interaction_data['district']
            if district not in self.user_interactions[user_id]['district_preferences']:
                self.user_interactions[user_id]['district_preferences'][district] = 0
            self.user_interactions[user_id]['district_preferences'][district] += 0.1
            
        # Add to viewed providers
        if interaction_type == 'view_provider' and 'provider_id' in interaction_data:
            self.user_interactions[user_id]['viewed_providers'].append(interaction_data['provider_id'])
            
        return True
        
    def record_booking(self, provider_id, user_id):
        """Record a booking to improve future recommendations"""
        if provider_id not in self.booking_history:
            self.booking_history[provider_id] = 0
            
        self.booking_history[provider_id] += 1
        
        # Also add a stronger interaction for the user
        if user_id:
            self.add_user_interaction(user_id, "booking", {"provider_id": provider_id})
            
            # Find the provider and boost its categories/districts more
            for provider in self.providers:
                if provider.get('id') == provider_id:
                    self.add_user_interaction(user_id, "view_provider", {
                        "provider_id": provider_id,
                        "category": provider.get('category'),
                        "district": provider.get('district')
                    })
                    break
                    
        return True
            
    def find_similar_providers(self, provider_id, limit=5):
        """Find similar providers based on clustering"""
        if not self.providers:
            return []
            
        # Find the provider
        target_provider = None
        for provider in self.providers:
            if provider.get('id') == provider_id:
                target_provider = provider
                break
                
        if not target_provider:
            return []
            
        # Get the cluster of the target provider
        target_cluster = target_provider.get('cluster')
        if target_cluster is None:
            # If no clustering has been done, fall back to simple similarity
            return self._find_similar_by_features(target_provider, limit)
            
        # Find providers in the same cluster
        similar_providers = [p for p in self.providers 
                           if p.get('cluster') == target_cluster and p.get('id') != provider_id]
                           
        # Sort by score
        similar_providers = sorted(similar_providers, key=lambda x: x.get('score', 0), reverse=True)
        
        return similar_providers[:limit]
        
    def _find_similar_by_features(self, target_provider, limit=5):
        """Find similar providers by feature similarity when clustering isn't available"""
        similarities = []
        
        target_category = target_provider.get('category', '')
        target_district = target_provider.get('district', '')
        target_rating = target_provider.get('rating', 3.0)
        
        for provider in self.providers:
            if provider.get('id') == target_provider.get('id'):
                continue
                
            # Simple similarity score
            similarity = 0
            
            # Same category is important
            if provider.get('category') == target_category:
                similarity += 3
                
            # Same district is somewhat important
            if provider.get('district') == target_district:
                similarity += 2
                
            # Rating within 1 point
            if abs(provider.get('rating', 3.0) - target_rating) <= 1:
                similarity += 1
                
            similarities.append((provider, similarity))
            
        # Sort by similarity score
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Return top similar providers
        return [item[0] for item in similarities[:limit]]
        
    def generate_availability(self, provider_id, days_ahead=7):
        """Generate realistic availability slots for a provider"""
        # Find the provider
        target_provider = None
        for provider in self.providers:
            if provider.get('id') == provider_id:
                target_provider = provider
                break
                
        if not target_provider:
            return []
            
        # Generate availability based on provider attributes
        availability = []
        now = datetime.now()
        
        # More experienced providers have fewer slots (they're busier)
        experience = target_provider.get('experience', 1)
        slots_per_day = max(1, 5 - min(experience // 3, 4))  # 1-5 slots per day based on experience
        
        # Generate slots for the next X days
        for day in range(days_ahead):
            current_date = now + timedelta(days=day)
            
            # No slots on Sundays
            if current_date.weekday() == 6:  # Sunday
                continue
                
            # Fewer slots on Saturday
            day_slots = slots_per_day
            if current_date.weekday() == 5:  # Saturday
                day_slots = max(1, day_slots - 2)
                
            # Generate random slots for this day
            day_availability = []
            possible_hours = list(range(10, 17))  # 10 AM to 4 PM
            np.random.shuffle(possible_hours)
            
            for i in range(min(day_slots, len(possible_hours))):
                hour = possible_hours[i]
                slot = {
                    "date": current_date.strftime("%Y-%m-%d"),
                    "time": f"{hour:02d}:00",
                    "available": True
                }
                day_availability.append(slot)
                
            availability.extend(day_availability)
            
        # Sort by date and time
        availability.sort(key=lambda x: (x["date"], x["time"]))
        
        # Add count of available slots to the provider
        target_provider['availableSlots'] = len(availability)
        
        return availability

# Initialize engine
recommendation_engine = RecommendationEngine()

# API endpoint functions
def initialize_with_providers(providers_data):
    recommendation_engine.load_providers(providers_data)
    recommendation_engine.cluster_providers()
    return {"status": "success", "message": "Recommendation engine initialized with providers"}

def get_recommendations(user_preferences=None, user_id=None, limit=20):
    recommendations = recommendation_engine.get_recommendations(user_preferences, user_id, limit)
    return {"recommendations": recommendations}

def find_similar_providers(provider_id, limit=5):
    similar = recommendation_engine.find_similar_providers(provider_id, limit)
    return {"similar_providers": similar}

def update_rl_reward(provider_id, reward_delta=0.05):
    for provider in recommendation_engine.providers:
        if provider.get('id') == provider_id:
            current_reward = provider.get('rl_reward', 0.0)
            provider['rl_reward'] = current_reward + reward_delta
            break
    return {"status": "success", "message": f"Updated RL reward for provider {provider_id}"}

def track_user_interaction(user_id, interaction_type, interaction_data):
    result = recommendation_engine.add_user_interaction(
        user_id, interaction_type, interaction_data
    )
    return {"status": "success", "message": f"Tracked user interaction"}

def record_booking(provider_id, user_id=None):
    result = recommendation_engine.record_booking(provider_id, user_id)
    return {"status": "success", "message": f"Recorded booking for provider {provider_id}"}

def get_provider_availability(provider_id, days_ahead=7):
    availability = recommendation_engine.generate_availability(provider_id, days_ahead)
    return {"availability": availability}

# Mock HTTP server response handlers
def handle_request(endpoint, data):
    """Simulate API endpoint handling"""
    if endpoint == "initialize":
        return initialize_with_providers(data.get('providers', []))
    elif endpoint == "recommendations":
        return get_recommendations(
            data.get('preferences'), 
            data.get('user_id'),
            data.get('limit', 20)
        )
    elif endpoint == "similar":
        return find_similar_providers(data.get('provider_id'), data.get('limit', 5))
    elif endpoint == "reward":
        return update_rl_reward(data.get('provider_id'), data.get('reward', 0.05))
    elif endpoint == "track_interaction":
        return track_user_interaction(
            data.get('user_id'), 
            data.get('interaction_type'),
            data.get('interaction_data', {})
        )
    elif endpoint == "booking":
        return record_booking(data.get('provider_id'), data.get('user_id'))
    elif endpoint == "availability":
        return get_provider_availability(data.get('provider_id'), data.get('days_ahead', 7))
    else:
        return {"status": "error", "message": "Unknown endpoint"}
