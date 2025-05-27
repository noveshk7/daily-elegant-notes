
import { useState, useEffect, useMemo } from "react";
import { startOfDay, differenceInDays, parseISO } from "date-fns";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'total' | 'days';
  achieved: boolean;
  achievedDate?: string;
}

const MILESTONES_KEY = "daily-notes-milestones";

export const useMilestones = (notes: any[]) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const defaultMilestones: Milestone[] = [
    // First steps milestones
    { id: "first-note", title: "First Steps", description: "Create your first note", icon: "✏️", requirement: 1, type: "total", achieved: false },
    { id: "early-adopter", title: "Early Adopter", description: "Create 3 notes", icon: "📖", requirement: 3, type: "total", achieved: false },
    { id: "note-enthusiast", title: "Note Enthusiast", description: "Create 5 notes", icon: "📝", requirement: 5, type: "total", achieved: false },
    { id: "getting-started", title: "Getting Started", description: "Create 10 notes", icon: "🚀", requirement: 10, type: "total", achieved: false },
    { id: "note-collector", title: "Note Collector", description: "Create 15 notes", icon: "📚", requirement: 15, type: "total", achieved: false },
    
    // Milestone progression
    { id: "note-writer", title: "Note Writer", description: "Create 25 notes", icon: "🖊️", requirement: 25, type: "total", achieved: false },
    { id: "prolific-writer", title: "Prolific Writer", description: "Create 50 notes", icon: "✍️", requirement: 50, type: "total", achieved: false },
    { id: "note-master", title: "Note Master", description: "Create 75 notes", icon: "🎓", requirement: 75, type: "total", achieved: false },
    { id: "note-expert", title: "Note Expert", description: "Create 100 notes", icon: "🏅", requirement: 100, type: "total", achieved: false },
    { id: "note-champion", title: "Note Champion", description: "Create 150 notes", icon: "🏆", requirement: 150, type: "total", achieved: false },
    
    // Higher milestones
    { id: "note-legend", title: "Note Legend", description: "Create 200 notes", icon: "👑", requirement: 200, type: "total", achieved: false },
    { id: "note-guru", title: "Note Guru", description: "Create 300 notes", icon: "🧙", requirement: 300, type: "total", achieved: false },
    { id: "note-sage", title: "Note Sage", description: "Create 500 notes", icon: "🔮", requirement: 500, type: "total", achieved: false },
    { id: "note-virtuoso", title: "Note Virtuoso", description: "Create 750 notes", icon: "🎭", requirement: 750, type: "total", achieved: false },
    { id: "note-titan", title: "Note Titan", description: "Create 1000 notes", icon: "⚡", requirement: 1000, type: "total", achieved: false },
    
    // Streak milestones
    { id: "daily-writer", title: "Daily Writer", description: "Write notes for 2 consecutive days", icon: "🔥", requirement: 2, type: "streak", achieved: false },
    { id: "consistent-writer", title: "Consistent Writer", description: "Write notes for 3 consecutive days", icon: "💪", requirement: 3, type: "streak", achieved: false },
    { id: "week-warrior", title: "Week Warrior", description: "Write notes for 7 consecutive days", icon: "⚡", requirement: 7, type: "streak", achieved: false },
    { id: "dedication-master", title: "Dedication Master", description: "Write notes for 14 consecutive days", icon: "🎯", requirement: 14, type: "streak", achieved: false },
    { id: "month-champion", title: "Month Champion", description: "Write notes for 30 consecutive days", icon: "🏆", requirement: 30, type: "streak", achieved: false },
    
    // Extended streak milestones
    { id: "streak-legend", title: "Streak Legend", description: "Write notes for 50 consecutive days", icon: "🌟", requirement: 50, type: "streak", achieved: false },
    { id: "streak-master", title: "Streak Master", description: "Write notes for 75 consecutive days", icon: "💎", requirement: 75, type: "streak", achieved: false },
    { id: "streak-titan", title: "Streak Titan", description: "Write notes for 100 consecutive days", icon: "👑", requirement: 100, type: "streak", achieved: false },
    { id: "streak-god", title: "Streak God", description: "Write notes for 150 consecutive days", icon: "⚡", requirement: 150, type: "streak", achieved: false },
    { id: "streak-immortal", title: "Streak Immortal", description: "Write notes for 200 consecutive days", icon: "🔥", requirement: 200, type: "streak", achieved: false },
    
    // Days-based milestones
    { id: "active-week", title: "Active Week", description: "Write notes on 5 different days", icon: "📅", requirement: 5, type: "days", achieved: false },
    { id: "productive-month", title: "Productive Month", description: "Write notes on 15 different days", icon: "📊", requirement: 15, type: "days", achieved: false },
    { id: "consistent-habit", title: "Consistent Habit", description: "Write notes on 30 different days", icon: "🔄", requirement: 30, type: "days", achieved: false },
    { id: "dedicated-user", title: "Dedicated User", description: "Write notes on 50 different days", icon: "🎖️", requirement: 50, type: "days", achieved: false },
    { id: "loyal-writer", title: "Loyal Writer", description: "Write notes on 75 different days", icon: "💝", requirement: 75, type: "days", achieved: false },
    
    // Extended days milestones
    { id: "veteran-writer", title: "Veteran Writer", description: "Write notes on 100 different days", icon: "🎗️", requirement: 100, type: "days", achieved: false },
    { id: "seasoned-noter", title: "Seasoned Noter", description: "Write notes on 150 different days", icon: "🏅", requirement: 150, type: "days", achieved: false },
    { id: "master-noter", title: "Master Noter", description: "Write notes on 200 different days", icon: "🎯", requirement: 200, type: "days", achieved: false },
    { id: "legendary-noter", title: "Legendary Noter", description: "Write notes on 300 different days", icon: "🌟", requirement: 300, type: "days", achieved: false },
    { id: "immortal-noter", title: "Immortal Noter", description: "Write notes on 365 different days", icon: "♾️", requirement: 365, type: "days", achieved: false },
    
    // Special achievement milestones
    { id: "weekend-warrior", title: "Weekend Warrior", description: "Write notes on 10 weekend days", icon: "🎪", requirement: 10, type: "days", achieved: false },
    { id: "early-bird", title: "Early Bird", description: "Write 25 notes before noon", icon: "🌅", requirement: 25, type: "total", achieved: false },
    { id: "night-owl", title: "Night Owl", description: "Write 25 notes after 8 PM", icon: "🦉", requirement: 25, type: "total", achieved: false },
    { id: "speed-writer", title: "Speed Writer", description: "Create 5 notes in one day", icon: "⚡", requirement: 5, type: "total", achieved: false },
    { id: "marathon-writer", title: "Marathon Writer", description: "Create 10 notes in one day", icon: "🏃", requirement: 10, type: "total", achieved: false },
    
    // Content-based milestones
    { id: "brief-noter", title: "Brief Noter", description: "Write 20 short notes", icon: "📄", requirement: 20, type: "total", achieved: false },
    { id: "detailed-writer", title: "Detailed Writer", description: "Write 15 long notes", icon: "📃", requirement: 15, type: "total", achieved: false },
    { id: "creative-mind", title: "Creative Mind", description: "Use 10 different note titles", icon: "🎨", requirement: 10, type: "total", achieved: false },
    { id: "organized-thinker", title: "Organized Thinker", description: "Create notes across 7 different months", icon: "🗂️", requirement: 7, type: "days", achieved: false },
    { id: "time-traveler", title: "Time Traveler", description: "Create notes for past dates", icon: "⏰", requirement: 5, type: "total", achieved: false },
    
    // Ultimate achievements
    { id: "note-architect", title: "Note Architect", description: "Build a collection of 2000 notes", icon: "🏗️", requirement: 2000, type: "total", achieved: false },
    { id: "note-emperor", title: "Note Emperor", description: "Rule over 3000 notes", icon: "👑", requirement: 3000, type: "total", achieved: false },
    { id: "note-deity", title: "Note Deity", description: "Transcend with 5000 notes", icon: "🌌", requirement: 5000, type: "total", achieved: false },
    { id: "infinite-writer", title: "Infinite Writer", description: "Achieve eternal status with 10000 notes", icon: "♾️", requirement: 10000, type: "total", achieved: false },
    { id: "ultimate-master", title: "Ultimate Master", description: "The pinnacle of note mastery", icon: "🔥", requirement: 15000, type: "total", achieved: false },
  ];

  // Load milestones from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MILESTONES_KEY);
      if (stored) {
        const parsedMilestones = JSON.parse(stored);
        // Merge with new milestones to ensure we have all 50
        const mergedMilestones = defaultMilestones.map(defaultMilestone => {
          const existing = parsedMilestones.find((m: Milestone) => m.id === defaultMilestone.id);
          return existing || defaultMilestone;
        });
        setMilestones(mergedMilestones);
      } else {
        setMilestones(defaultMilestones);
      }
    } catch (error) {
      console.error("Error loading milestones:", error);
      setMilestones(defaultMilestones);
    }
  }, []);

  // Calculate current stats
  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const uniqueDates = new Set(notes.map(note => startOfDay(parseISO(note.date)).toDateString())).size;
    
    // Calculate current streak
    const sortedDates = [...new Set(notes.map(note => startOfDay(parseISO(note.date)).toDateString()))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentStreak = 0;
    const today = startOfDay(new Date());
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const expectedDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      
      if (Math.abs(differenceInDays(date, expectedDate)) <= 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalNotes,
      uniqueDays: uniqueDates,
      currentStreak,
    };
  }, [notes]);

  // Check and update milestones
  useEffect(() => {
    if (milestones.length === 0) return;

    const updatedMilestones = milestones.map(milestone => {
      if (milestone.achieved) return milestone;

      let shouldAchieve = false;
      
      switch (milestone.type) {
        case 'total':
          shouldAchieve = stats.totalNotes >= milestone.requirement;
          break;
        case 'streak':
          shouldAchieve = stats.currentStreak >= milestone.requirement;
          break;
        case 'days':
          shouldAchieve = stats.uniqueDays >= milestone.requirement;
          break;
      }

      if (shouldAchieve) {
        return {
          ...milestone,
          achieved: true,
          achievedDate: new Date().toISOString(),
        };
      }

      return milestone;
    });

    const hasNewAchievements = updatedMilestones.some((milestone, index) => 
      milestone.achieved && !milestones[index]?.achieved
    );

    if (hasNewAchievements) {
      setMilestones(updatedMilestones);
      localStorage.setItem(MILESTONES_KEY, JSON.stringify(updatedMilestones));
    }
  }, [stats, milestones]);

  const achievedCount = milestones.filter(m => m.achieved).length;
  const recentAchievements = milestones
    .filter(m => m.achieved && m.achievedDate)
    .sort((a, b) => new Date(b.achievedDate!).getTime() - new Date(a.achievedDate!).getTime())
    .slice(0, 3);

  return {
    milestones,
    stats,
    achievedCount,
    recentAchievements,
  };
};
