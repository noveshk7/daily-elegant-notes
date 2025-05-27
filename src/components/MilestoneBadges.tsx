
import { useState } from "react";
import { Trophy, Star, Award, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Milestone } from "../hooks/useMilestones";

interface MilestoneBadgesProps {
  milestones: Milestone[];
  stats: {
    totalNotes: number;
    uniqueDays: number;
    currentStreak: number;
  };
  achievedCount: number;
  recentAchievements: Milestone[];
}

const MilestoneBadges = ({ milestones, stats, achievedCount, recentAchievements }: MilestoneBadgesProps) => {
  const [showAll, setShowAll] = useState(false);

  const getProgressPercentage = (milestone: Milestone) => {
    let current = 0;
    switch (milestone.type) {
      case 'total':
        current = stats.totalNotes;
        break;
      case 'streak':
        current = stats.currentStreak;
        break;
      case 'days':
        current = stats.uniqueDays;
        break;
    }
    return Math.min((current / milestone.requirement) * 100, 100);
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 dark:border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Your Progress</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.totalNotes}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Notes</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.currentStreak}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Day Streak</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{achievedCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Badges</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Recent Achievements</h4>
          </div>
          <div className="space-y-2">
            {recentAchievements.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3">
                <span className="text-lg">{milestone.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">{milestone.title}</div>
                  {milestone.achievedDate && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      {format(parseISO(milestone.achievedDate), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Milestones
          </h4>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {(showAll ? milestones : milestones.slice(0, 3)).map((milestone) => {
            const progress = getProgressPercentage(milestone);
            return (
              <div
                key={milestone.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  milestone.achieved
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white/30 dark:bg-slate-700/30 border-white/30 dark:border-slate-600/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${milestone.achieved ? 'opacity-100' : 'opacity-60'}`}>
                    {milestone.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className={`font-medium text-sm ${
                        milestone.achieved 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {milestone.title}
                      </h5>
                      {milestone.achieved && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {milestone.description}
                    </p>
                    {!milestone.achieved && (
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MilestoneBadges;
