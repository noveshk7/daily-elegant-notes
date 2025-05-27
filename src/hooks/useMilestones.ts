
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
    {
      id: "first-note",
      title: "First Steps",
      description: "Create your first note",
      icon: "✏️",
      requirement: 1,
      type: "total",
      achieved: false,
    },
    {
      id: "note-enthusiast",
      title: "Note Enthusiast",
      description: "Create 10 notes",
      icon: "📝",
      requirement: 10,
      type: "total",
      achieved: false,
    },
    {
      id: "daily-writer",
      title: "Daily Writer",
      description: "Write notes for 3 consecutive days",
      icon: "🔥",
      requirement: 3,
      type: "streak",
      achieved: false,
    },
    {
      id: "week-warrior",
      title: "Week Warrior",
      description: "Write notes for 7 consecutive days",
      icon: "⚡",
      requirement: 7,
      type: "streak",
      achieved: false,
    },
    {
      id: "productive-month",
      title: "Productive Month",
      description: "Write notes on 20 different days",
      icon: "🏆",
      requirement: 20,
      type: "days",
      achieved: false,
    },
    {
      id: "note-master",
      title: "Note Master",
      description: "Create 50 notes",
      icon: "👑",
      requirement: 50,
      type: "total",
      achieved: false,
    },
  ];

  // Load milestones from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MILESTONES_KEY);
      if (stored) {
        const parsedMilestones = JSON.parse(stored);
        setMilestones(parsedMilestones);
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
