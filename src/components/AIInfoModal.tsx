
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const AIInfoModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          AI-Powered Recommendations
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Driven Recommendation System</DialogTitle>
          <DialogDescription>
            How our advanced AI helps you find the best legal experts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="rounded-md bg-blue-50 p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Dynamic Scoring Engine</h3>
            <p className="text-blue-700">
              Our AI calculates a composite score for each legal provider using multiple factors:
            </p>
            <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
              <li>Provider's rating (40%)</li>
              <li>Verification status (30%)</li>
              <li>Category match with your search (20%)</li>
              <li>Proximity to your location (10%)</li>
            </ul>
          </div>
          
          <div className="rounded-md bg-purple-50 p-4">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Reinforcement Learning</h3>
            <p className="text-purple-700">
              Our system gets smarter with every interaction! Each time you:
            </p>
            <ul className="list-disc list-inside text-purple-700 mt-2 space-y-1">
              <li>Click on a provider (+0.05 score)</li>
              <li>Save a provider to your list (+0.1 score)</li>
              <li>Schedule a consultation (+0.15 score)</li>
            </ul>
            <p className="text-purple-700 mt-2">
              This helps us prioritize providers that users find most helpful.
            </p>
          </div>
          
          <div className="rounded-md bg-green-50 p-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Fuzzy Logic Trust Labels</h3>
            <p className="text-green-700">
              We apply intelligent rules to assign badges:
            </p>
            <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
              <li>"Highly Recommended" - Score above 4.5</li>
              <li>"Fast & Trusted" - Response time under 5 minutes</li>
              <li>"New Provider" - Rating under 3.5 or experience less than 1 year</li>
              <li>"Trusted Advisor" - Verified providers with over 10 years experience</li>
            </ul>
          </div>
          
          <div className="rounded-md bg-amber-50 p-4">
            <h3 className="text-lg font-medium text-amber-800 mb-2">K-Means Clustering</h3>
            <p className="text-amber-700">
              We group similar providers together based on:
            </p>
            <ul className="list-disc list-inside text-amber-700 mt-2 space-y-1">
              <li>Legal category expertise</li>
              <li>Geographic location</li>
              <li>Experience level</li>
              <li>Rating patterns</li>
            </ul>
            <p className="text-amber-700 mt-2">
              This helps us find "similar providers" and make better recommendations even with limited search criteria.
            </p>
          </div>
          
          <p className="text-gray-500 text-sm italic">
            *Our recommendation system is powered by Python-based AI algorithms including Q-learning, fuzzy logic systems, and cluster analysis.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIInfoModal;
