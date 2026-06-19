/**
 * BaileyTrades Academy - Lessons Component
 * Handles rendering of educational modules, quizzes, homepage roadmaps, progress bars,
 * and linking to the educational visualization chart.
 */

import { lessons } from '../data/lessons.js';

export class Lessons {
  constructor(appRef) {
    this.app = appRef;
    this.activeLesson = null;
    
    // Load progress from localStorage or default empty
    this.completedLessons = new Set(
      JSON.parse(localStorage.getItem('baileytrades_completed_lessons') || '[]')
    );
    
    // Classroom elements
    this.indexListEl = document.getElementById('lesson-index-list');
    this.activePanelEl = document.getElementById('active-lesson-container');
    this.introPanelEl = document.getElementById('lessons-intro-panel');
    this.backBtn = document.getElementById('back-to-lessons-btn');
    this.completeBtn = document.getElementById('complete-lesson-btn');
    this.progressTextEl = document.getElementById('lesson-progress-text');
    
    // Homepage progress elements
    this.homeRoadmapEl = document.getElementById('home-roadmap-container');
    this.homeProgressPercentageEl = document.getElementById('home-progress-percentage');
    this.homeProgressFillEl = document.getElementById('home-progress-fill');
    this.homeProgressLabelEl = document.getElementById('home-progress-label');
    
    this.bindEvents();
    this.renderList();
    this.renderHomeRoadmap();
    this.updateProgressText();
  }

  bindEvents() {
    // Back button in classroom goes back to showing the empty state / index roadmap
    this.backBtn.addEventListener('click', () => this.showIntro());
    this.completeBtn.addEventListener('click', () => this.completeActiveLesson());
  }

  // Render Sidebar List in Classroom View
  renderList() {
    if (!this.indexListEl) return;
    this.indexListEl.innerHTML = '';
    
    lessons.forEach(lesson => {
      const isCompleted = this.completedLessons.has(lesson.id);
      const isActive = this.activeLesson && this.activeLesson.id === lesson.id;
      
      const itemEl = document.createElement('div');
      itemEl.className = `lesson-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
      itemEl.dataset.id = lesson.id;
      
      itemEl.innerHTML = `
        <div class="lesson-info">
          <div class="lesson-icon">
            <i data-lucide="${lesson.icon}"></i>
          </div>
          <div class="lesson-title-meta">
            <h4>${lesson.title}</h4>
          </div>
        </div>
        <div class="lesson-status-icon">
          <i data-lucide="${isCompleted ? 'check-circle' : 'chevron-right'}"></i>
        </div>
      `;
      
      itemEl.addEventListener('click', () => this.openLesson(lesson.id));
      this.indexListEl.appendChild(itemEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Render the Dynamic Roadmap Grid on the Homepage Dashboard
  renderHomeRoadmap() {
    if (!this.homeRoadmapEl) return;
    this.homeRoadmapEl.innerHTML = '';
    
    lessons.forEach((lesson, index) => {
      const isCompleted = this.completedLessons.has(lesson.id);
      const formattedNum = String(index + 1).padStart(2, '0');
      
      const cardEl = document.createElement('div');
      cardEl.className = `roadmap-item ${isCompleted ? 'completed' : ''}`;
      cardEl.dataset.id = lesson.id;
      
      // Determine badge class & text
      let badgeHtml = '';
      if (isCompleted) {
        badgeHtml = `<span class="roadmap-badge badge-completed"><i data-lucide="check" style="width:10px; height:10px; display:inline; vertical-align:middle;"></i> Done</span>`;
      } else {
        badgeHtml = `<span class="roadmap-badge badge-start">Start</span>`;
      }
      
      cardEl.innerHTML = `
        <div class="roadmap-item-header">
          <span class="roadmap-number">${formattedNum}</span>
          ${badgeHtml}
        </div>
        <h4>${lesson.title}</h4>
        <p>${lesson.shortDescription}</p>
      `;
      
      cardEl.addEventListener('click', () => {
        // Switch to classroom view and select this lesson
        this.app.switchView('lessons', lesson.id);
      });
      
      this.homeRoadmapEl.appendChild(cardEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  openLesson(id) {
    this.activeLesson = lessons.find(l => l.id === id);
    if (!this.activeLesson) return;
    
    // Update UI panels visibility
    this.introPanelEl.classList.add('hidden');
    this.activePanelEl.classList.remove('hidden');
    
    // Set texts
    document.getElementById('active-lesson-title').textContent = this.activeLesson.title;
    document.getElementById('active-lesson-text').innerHTML = this.activeLesson.content;
    
    // Render Quiz
    this.renderQuiz(this.activeLesson.quiz);
    
    // Reset complete button
    this.completeBtn.disabled = true;
    this.completeBtn.className = 'secondary-btn full-width mt-3';
    this.completeBtn.textContent = "Answer the Quiz to Complete";

    // Update Concept Visualizer chart depending on the lesson content
    this.updateVisualizerForLesson(id);
    
    this.renderList(); // Update sidebar active highlight
  }

  showIntro() {
    this.activeLesson = null;
    this.introPanelEl.classList.remove('hidden');
    this.activePanelEl.classList.add('hidden');
    
    if (this.app.lessonsChart) {
      this.app.lessonsChart.clearHighlight();
      this.app.lessonsChart.toggleSMAIndicator(false);
      this.app.lessonsChart.toggleSRIndicator(false);
    }
    
    this.renderList();
  }

  // Update visualizer chart details
  updateVisualizerForLesson(lessonId) {
    const chart = this.app.lessonsChart;
    const badgeEl = document.getElementById('lessons-visualizer-badge');
    const tipEl = document.getElementById('lessons-visualizer-tip');
    
    if (!chart) return;
    
    // Clear all chart indicator states
    chart.clearHighlight();
    chart.toggleSMAIndicator(false);
    chart.toggleSRIndicator(false);
    
    if (lessonId === 1) {
      // Basic Introduction: Show simple bull market feed without filters
      badgeEl.textContent = "Market Basics";
      tipEl.innerHTML = `<i data-lucide="info" class="text-accent-cyan" style="width:14px; height:14px; display:inline; vertical-align:middle; margin-right:4px;"></i> In Lesson 1, look at how buyers driving volume causes the stock chart to print consecutive green candles upward.`;
    } 
    else if (lessonId === 2) {
      // Candlesticks details: Highlight a specific candle with wicks
      badgeEl.textContent = "Candlesticks Anatomy";
      tipEl.innerHTML = `<i data-lucide="info" class="text-accent-cyan" style="width:14px; height:14px; display:inline; vertical-align:middle; margin-right:4px;"></i> Look at the highlighted candle. Hover over individual candles with your mouse to view details (Open, High, Low, Close) in the tooltip.`;
      
      // Highlight last candle
      setTimeout(() => {
        const visibleCount = chart.getVisibleCandles().length;
        if (visibleCount > 2) {
          chart.setHighlight(chart.startIndex + visibleCount - 3);
        }
      }, 100);
    } 
    else if (lessonId === 3) {
      // Support & Resistance
      badgeEl.textContent = "Support & Resistance";
      tipEl.innerHTML = `<i data-lucide="info" class="text-accent-cyan" style="width:14px; height:14px; display:inline; vertical-align:middle; margin-right:4px;"></i> The cyan dashed line represents Support (buying floor). The rose dashed line represents Resistance (selling ceiling).`;
      
      chart.toggleSRIndicator(true);
    } 
    else if (lessonId === 4) {
      // Moving averages
      badgeEl.textContent = "Trend Tracking (SMA)";
      tipEl.innerHTML = `<i data-lucide="info" class="text-accent-cyan" style="width:14px; height:14px; display:inline; vertical-align:middle; margin-right:4px;"></i> The golden line is the Simple Moving Average (SMA 20). If prices stay consistently above this line, the stock is in a solid uptrend.`;
      
      chart.toggleSMAIndicator(true);
    } 
    else if (lessonId === 5) {
      // Risk Management
      badgeEl.textContent = "Risk Management";
      tipEl.innerHTML = `<i data-lucide="info" class="text-accent-cyan" style="width:14px; height:14px; display:inline; vertical-align:middle; margin-right:4px;"></i> Enter simulator mode to practice managing risk on live-scrolling scenarios using checklists.`;
      
      chart.toggleSMAIndicator(true);
      chart.toggleSRIndicator(true);
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderQuiz(quiz) {
    const container = document.getElementById('lesson-quiz-container');
    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackEl = document.getElementById('quiz-feedback');
    
    if (!quiz) {
      container.classList.add('hidden');
      return;
    }
    
    container.classList.remove('hidden');
    document.getElementById('quiz-question').textContent = quiz.question;
    optionsContainer.innerHTML = '';
    
    feedbackEl.className = 'quiz-feedback hidden';
    feedbackEl.textContent = '';
    
    quiz.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.submitQuizAnswer(idx, btn));
      optionsContainer.appendChild(btn);
    });
  }

  submitQuizAnswer(selectedIdx, buttonEl) {
    const quiz = this.activeLesson.quiz;
    const feedbackEl = document.getElementById('quiz-feedback');
    const optionButtons = document.querySelectorAll('.quiz-opt-btn');
    
    // Disable other choice click buttons
    optionButtons.forEach(btn => {
      btn.className = 'quiz-opt-btn';
      btn.disabled = true;
    });
    
    const isCorrect = selectedIdx === quiz.correctAnswer;
    
    if (isCorrect) {
      buttonEl.className = 'quiz-opt-btn correct';
      feedbackEl.className = 'quiz-feedback success mt-2';
      feedbackEl.innerHTML = `<strong>Correct!</strong> ${quiz.explanation}`;
      
      // Unlock complete button
      this.completeBtn.disabled = false;
      this.completeBtn.className = 'primary-btn full-width mt-3';
      this.completeBtn.innerHTML = `Complete Lesson <i data-lucide="check-circle"></i>`;
    } else {
      buttonEl.className = 'quiz-opt-btn incorrect';
      
      const correctBtn = optionButtons[quiz.correctAnswer];
      if (correctBtn) {
        correctBtn.className = 'quiz-opt-btn correct';
      }
      
      feedbackEl.className = 'quiz-feedback error mt-2';
      feedbackEl.innerHTML = `<strong>Incorrect.</strong> ${quiz.explanation}`;
      
      // Still unlock the complete button so they are not blocked from progressing
      this.completeBtn.disabled = false;
      this.completeBtn.className = 'primary-btn full-width mt-3';
      this.completeBtn.innerHTML = `Complete Lesson <i data-lucide="check-circle"></i>`;
    }
    
    feedbackEl.classList.remove('hidden');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  completeActiveLesson() {
    if (!this.activeLesson) return;
    
    this.completedLessons.add(this.activeLesson.id);
    localStorage.setItem(
      'baileytrades_completed_lessons',
      JSON.stringify(Array.from(this.completedLessons))
    );
    
    this.updateProgressText();
    this.renderHomeRoadmap(); // Refresh badges on homepage roadmap
    
    // Highlight next lesson or return to roadmap
    const nextIdx = lessons.findIndex(l => l.id === this.activeLesson.id) + 1;
    if (nextIdx < lessons.length) {
      this.openLesson(lessons[nextIdx].id);
    } else {
      // All lessons complete!
      alert("Congratulations! You have completed all foundational lessons. You now have full access to practice your skills in the Trading Simulator!");
      this.showIntro();
    }
  }

  updateProgressText() {
    const totalCount = lessons.length;
    const completedCount = this.completedLessons.size;
    
    // Sidebar progress
    if (this.progressTextEl) {
      this.progressTextEl.textContent = `${completedCount} of ${totalCount}`;
    }
    
    // Homepage progress details
    if (this.homeProgressLabelEl) {
      this.homeProgressLabelEl.textContent = `${completedCount} of ${totalCount} Lessons`;
    }
    if (this.homeProgressPercentageEl) {
      const pct = Math.round((completedCount / totalCount) * 100);
      this.homeProgressPercentageEl.textContent = `${pct}% Completed`;
      this.homeProgressFillEl.style.width = `${pct}%`;
    }
  }
  
  resetProgress() {
    this.completedLessons.clear();
    localStorage.removeItem('baileytrades_completed_lessons');
    this.updateProgressText();
    this.renderHomeRoadmap();
    this.showIntro();
  }
}
