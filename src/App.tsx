/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import MockTestEngine from './components/MockTestEngine';
import { mockTests } from './data/questions';
import { getSyllabusTestById } from './data/syllabusTestData';
import { User, TestResult, MockTest } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [customTests, setCustomTests] = useState<MockTest[]>([]);

  // Load user profile session and custom tests on initial mount
  useEffect(() => {
    const lastLoggedInEmail = localStorage.getItem('lexrank_last_logged_in');
    if (lastLoggedInEmail) {
      const storedUserData = localStorage.getItem(`lexrank_user_${lastLoggedInEmail}`);
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData) as User;
          if (user.email === 'sundaramteke@gmail.com') {
            user.plan = 'premium';
          }
          setCurrentUser(user);
        } catch (e) {
          console.error('Error parsing stored user profile.', e);
        }
      }
    }

    const storedCustom = localStorage.getItem('lexrank_custom_tests');
    if (storedCustom) {
      try {
        setCustomTests(JSON.parse(storedCustom));
      } catch (e) {
        console.error('Error parsing stored custom tests.', e);
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    if (user.email === 'sundaramteke@gmail.com') {
      user.plan = 'premium';
    }
    setCurrentUser(user);
    localStorage.setItem('lexrank_last_logged_in', user.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('lexrank_last_logged_in');
    setCurrentUser(null);
    setActiveTestId(null);
  };

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
  };

  const handleAddCustomTest = (newTest: MockTest) => {
    const updated = [newTest, ...customTests];
    setCustomTests(updated);
    localStorage.setItem('lexrank_custom_tests', JSON.stringify(updated));
  };

  const handleUpdatePlan = (newPlan: 'free' | 'basic' | 'premium') => {
    if (!currentUser) return;
    const finalPlan = currentUser.email === 'sundaramteke@gmail.com' ? 'premium' : newPlan;
    const updatedUser: User = {
      ...currentUser,
      plan: finalPlan
    };
    localStorage.setItem(`lexrank_user_${currentUser.email}`, JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const handleSubmitResult = (newResult: TestResult) => {
    if (!currentUser) return;

    // Append new performance log entry
    const updatedCompletedTests = [newResult, ...currentUser.completedTests];
    
    // Increment streak days (with max cap check, just for study gamification)
    const updatedProfile = {
      ...currentUser.profile,
      studyStreakDays: currentUser.profile.studyStreakDays + 1
    };

    const updatedUser: User = {
      ...currentUser,
      plan: currentUser.email === 'sundaramteke@gmail.com' ? 'premium' : currentUser.plan,
      profile: updatedProfile,
      completedTests: updatedCompletedTests
    };

    // Commit changes to persistent local storage context
    localStorage.setItem(`lexrank_user_${currentUser.email}`, JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const allTests = [...mockTests, ...customTests];
  let activeTest = allTests.find(t => t.id === activeTestId);
  if (!activeTest && activeTestId && activeTestId.startsWith('syllabus-test-')) {
    activeTest = getSyllabusTestById(activeTestId) || undefined;
  }

  return (
    <MobileFrame>
      {!currentUser ? (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      ) : activeTestId && activeTest ? (
        <MockTestEngine 
          test={activeTest} 
          onExit={() => setActiveTestId(null)}
          onSubmitResult={handleSubmitResult}
        />
      ) : (
        <Dashboard 
          user={currentUser}
          availableTests={allTests}
          onStartTest={handleStartTest}
          onLogout={handleLogout}
          onAddCustomTest={handleAddCustomTest}
          onUpdatePlan={handleUpdatePlan}
        />
      )}
    </MobileFrame>
  );
}

