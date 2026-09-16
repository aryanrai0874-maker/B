/* =========================================================
   Unnati's Birthday Website — script.js
   Vanilla JS only. No frameworks, no build step.
   ========================================================= */

/* ---------------------------------------------------------
   0. BACKGROUND FLOATING HEARTS (all pages)
   --------------------------------------------------------- */
(function backgroundFloaters(){
  const layer = document.querySelector('.bg-floaters');
  if(!layer) return;

  const symbols = ['💗','✨','🎀','⭐'];
  const count = window.innerWidth < 600 ? 8 : 14;

  for(let i = 0; i < count; i++){
    const span = document.createElement('span');
    span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.animationDuration = (14 + Math.random() * 12) + 's';
    span.style.animationDelay = (Math.random() * 14) + 's';
    span.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    span.addEventListener('click', () => {
      span.classList.add('pop-fade');
      setTimeout(() => span.remove(), 500);
    });
    layer.appendChild(span);
  }
})();

/* ---------------------------------------------------------
   1. CELEBRATION EFFECTS — confetti, poppers, floating hearts
   Reusable everywhere via triggerCelebration()
   --------------------------------------------------------- */
function ensureFxLayer(){
  let fx = document.getElementById('fx-layer');
  if(!fx){
    fx = document.createElement('div');
    fx.id = 'fx-layer';
    document.body.appendChild(fx);
  }
  return fx;
}

function triggerCelebration(){
  const fx = ensureFxLayer();
  const colors = ['#e2586f', '#ffd9b8', '#e8dff5', '#fbdde3', '#ffffff'];
  const emojis = ['💗','✨','⭐','🎈','🎉'];

  // confetti pieces
  for(let i = 0; i < 46; i++){
    const piece = document.createElement('div');
    piece.className = 'fx-piece';
    const isEmoji = Math.random() < 0.4;
    const startX = Math.random() * window.innerWidth;

    if(isEmoji){
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.fontSize = (1 + Math.random() * 1.3) + 'rem';
    } else {
      piece.style.width = piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() < 0.5 ? '50%' : '2px';
    }

    piece.style.left = startX + 'px';
    piece.style.top = '-30px';
    fx.appendChild(piece);

    const fallDuration = 2200 + Math.random() * 1600;
    const drift = (Math.random() - 0.5) * 220;
    const rotateEnd = (Math.random() - 0.5) * 720;

    piece.animate([
      { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${drift}px, ${window.innerHeight + 60}px) rotate(${rotateEnd}deg)`, opacity: 0.9 }
    ], {
      duration: fallDuration,
      easing: 'cubic-bezier(.25,.46,.45,.94)'
    });

    setTimeout(() => piece.remove(), fallDuration + 100);
  }

  // party poppers from both sides
  [ { side: 'left', originX: 0 }, { side: 'right', originX: window.innerWidth } ].forEach(popper => {
    for(let i = 0; i < 14; i++){
      const bit = document.createElement('div');
      bit.className = 'fx-piece';
      bit.textContent = Math.random() < 0.5 ? '✨' : '💫';
      bit.style.left = popper.originX + 'px';
      bit.style.top = (window.innerHeight - 60) + 'px';
      bit.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
      fx.appendChild(bit);

      const angle = popper.side === 'left'
        ? (Math.random() * -70 - 20)
        : (Math.random() * 70 + 200);
      const distance = 180 + Math.random() * 220;
      const rad = angle * Math.PI / 180;
      const dx = Math.cos(rad) * distance;
      const dy = Math.sin(rad) * distance;

      const dur = 1200 + Math.random() * 600;
      bit.animate([
        { transform: 'translate(0,0) scale(0.6)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0 }
      ], { duration: dur, easing: 'ease-out' });

      setTimeout(() => bit.remove(), dur + 100);
    }
  });
}

/* ---------------------------------------------------------
   2. HOMEPAGE — birthday board click
   --------------------------------------------------------- */
(function homepageBoard(){
  const board = document.getElementById('birthday-board');
  const message = document.getElementById('reveal-message');
  if(!board) return;

  board.addEventListener('click', () => {
    triggerCelebration();
    if(message){
      message.classList.add('show');
    }
    board.classList.remove('board-bounce');
    void board.offsetWidth; // restart animation
    board.classList.add('board-bounce');
  });

  board.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' || e.key === ' ') board.click();
  });
})();

/* ---------------------------------------------------------
   3. MEMORIES PAGE — lightbox
   --------------------------------------------------------- */
(function photoLightbox(){
  const polaroids = document.querySelectorAll('.polaroid');
  const lightbox = document.getElementById('lightbox');
  if(!polaroids.length || !lightbox) return;

  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('.lightbox-cap');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const cap = card.querySelector('.cap');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('open');
    });
  });

  function closeLightbox(){ lightbox.classList.remove('open'); }
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeLightbox();
  });
})();

/* ---------------------------------------------------------
   4. MEMORIES PAGE — flip cards
   --------------------------------------------------------- */
(function flipCards(){
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
})();

/* ---------------------------------------------------------
   5. GAME 1 — Catch the Hearts
   --------------------------------------------------------- */
(function catchHeartsGame(){
  const field = document.getElementById('heart-field');
  const startBtn = document.getElementById('hearts-start');
  const scoreEl = document.getElementById('hearts-score');
  const timeEl = document.getElementById('hearts-time');
  const resultBox = document.getElementById('hearts-result');
  if(!field || !startBtn) return;

  let score = 0;
  let timeLeft = 30;
  let spawnInterval, timerInterval;
  let playing = false;

  function spawnHeart(){
    const heart = document.createElement('button');
    heart.className = 'flying-heart';
    heart.textContent = '💗';
    heart.style.left = Math.random() * 88 + '%';
    heart.style.top = Math.random() * 82 + '%';
    field.appendChild(heart);

    const lifetime = Math.max(650, 1400 - (30 - timeLeft) * 22);

    const removeTimer = setTimeout(() => heart.remove(), lifetime);

    heart.addEventListener('click', () => {
      score++;
      scoreEl.textContent = score;
      clearTimeout(removeTimer);
      spawnSparkle(heart.style.left, heart.style.top);
      heart.remove();
    });
  }

  function spawnSparkle(left, top){
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = left;
    sparkle.style.top = top;
    sparkle.style.fontSize = '1.4rem';
    sparkle.style.pointerEvents = 'none';
    field.appendChild(sparkle);
    sparkle.animate([
      { transform: 'scale(0.5)', opacity: 1 },
      { transform: 'scale(1.8)', opacity: 0 }
    ], { duration: 450, easing: 'ease-out' });
    setTimeout(() => sparkle.remove(), 450);
  }

  function endGame(){
    playing = false;
    clearInterval(spawnInterval);
    clearInterval(timerInterval);
    field.querySelectorAll('.flying-heart').forEach(h => h.remove());

    let message;
    if(score >= 20){
      message = `Okay WOW... ${score} hearts caught? You might actually be stealing mine too. 💗`;
    } else if(score >= 10){
      message = `${score} hearts! Not bad at all — almost as many as the times you make me smile in a day.`;
    } else {
      message = `You caught ${score} hearts. That's okay — you already caught the important one. Mine. 💗`;
    }
    resultBox.textContent = message;
    resultBox.classList.add('show');
    startBtn.textContent = 'Play again';
    startBtn.disabled = false;
  }

  startBtn.addEventListener('click', () => {
    if(playing) return;
    playing = true;
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    resultBox.classList.remove('show');
    startBtn.disabled = true;
    startBtn.textContent = 'Catching...';

    spawnInterval = setInterval(spawnHeart, 700);
    timerInterval = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if(timeLeft <= 0) endGame();
    }, 1000);
  });
})();

/* ---------------------------------------------------------
   6. GAME 2 — Find the Hidden Heart
   --------------------------------------------------------- */
(function hiddenHeartGame(){
  const scene = document.getElementById('hidden-scene');
  const resultBox = document.getElementById('hidden-result');
  if(!scene) return;

  scene.querySelectorAll('.scene-object').forEach(obj => {
    obj.addEventListener('click', () => {
      if(obj.dataset.correct === 'true'){
        obj.classList.add('found');
        triggerCelebration();
        resultBox.textContent = 'YOU FOUND IT! ❤️ Ab pta chala why i was asking for your confirmation of your favourite flower 🌷 HEHE. I know its not much but I thought it would be cute😉💗';
        resultBox.classList.add('show');
        scene.querySelectorAll('.scene-object').forEach(o => o.style.pointerEvents = 'none');
      } else {
        obj.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(0)' }
        ], { duration: 300 });
      }
    });
  });
})();

/* ---------------------------------------------------------
   7. GAME 3 — Birthday Memory Quiz
   --------------------------------------------------------- */
(function birthdayQuiz(){
  const quiz = document.getElementById('quiz');
  if(!quiz) return;

  const questions = quiz.querySelectorAll('.quiz-question');
  const resultBox = document.getElementById('quiz-result');
  let current = 0;
  let correctCount = 0;

  questions.forEach((q, index) => {
    const options = q.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if(opt.classList.contains('picked')) return;
        options.forEach(o => o.classList.remove('picked'));
        opt.classList.add('picked');
        if(opt.dataset.correct === 'true') correctCount++;

        setTimeout(() => {
          q.classList.remove('active');
          current++;
          if(current < questions.length){
            questions[current].classList.add('active');
          } else {
            showQuizResult();
          }
        }, 500);
      });
    });
  });

  function showQuizResult(){
    let msg;
    if(correctCount === questions.length){
      msg = `Perfect score, ${correctCount}/${questions.length}! Clearly you know exactly how loved you are. 🎀`;
    } else if(correctCount >= questions.length / 2){
      msg = `${correctCount}/${questions.length} — pretty good! Guess I'll just have to remind you about the rest. 💗`;
    } else {
      msg = `${correctCount}/${questions.length}... okay, I have some catching up to do in telling you these things more often. ❤️`;
    }
    resultBox.textContent = msg;
    resultBox.classList.add('show');
  }
})();

/* ---------------------------------------------------------
   8. LETTERS PAGE — envelopes
   --------------------------------------------------------- */
(function loveLetters(){
  const envelopes = document.querySelectorAll('.envelope');
  const modal = document.getElementById('note-modal');
  if(!envelopes.length || !modal) return;

  const noteText = modal.querySelector('.note-text');
  const closeBtn = modal.querySelector('.note-close');

  envelopes.forEach(env => {
    env.addEventListener('click', () => {
      const message = env.dataset.message || '';
      noteText.textContent = message;
      modal.classList.add('open');
    });
  });

  function closeModal(){ modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
})();

/* ---------------------------------------------------------
   9. FINAL PAGE — reveal + typing effect
   --------------------------------------------------------- */
(function finalReveal(){
  const openBtn = document.getElementById('open-final');
  const preBox = document.getElementById('final-pre');
  const stage = document.getElementById('final-stage');
  if(!openBtn) return;

  const heading = document.getElementById('final-heading');
  const thankYou = document.getElementById('thank-you');
  const typedEl = document.getElementById('typed-message');
  const madeWithLove = document.getElementById('made-with-love');

  const fullMessage = typedEl ? typedEl.dataset.fulltext || '' : '';

  openBtn.addEventListener('click', () => {
    preBox.style.display = 'none';
    stage.classList.add('active-final');
    triggerCelebration();
    setTimeout(triggerCelebration, 900);

    setTimeout(() => heading.classList.add('show'), 300);
    setTimeout(() => thankYou.classList.add('show'), 900);
    setTimeout(() => typeMessage(), 1500);
  });

  function typeMessage(){
    if(!typedEl) return;
    typedEl.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    let i = 0;

    function step(){
      if(i <= fullMessage.length){
        typedEl.textContent = fullMessage.slice(0, i);
        typedEl.appendChild(cursor);
        i++;
        setTimeout(step, 38);
      } else {
        cursor.remove();
        madeWithLove.classList.add('show');
      }
    }
    step();
  }
})();

/* ---------------------------------------------------------
   10. BACKGROUND MUSIC TOGGLE (all pages, if audio element present)
   --------------------------------------------------------- */
(function musicToggle(){
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-audio');
  if(!btn || !audio) return;

  const MUSIC_KEY = 'birthday-song-playing';
  const MUSIC_TIME_KEY = 'birthday-song-time';
  const isFirstPage = /(^|\/)index\.html?$/i.test(window.location.pathname);

  function updateButton(playing){
    btn.textContent = playing ? '♫ Pause our little soundtrack' : '♫ Play our little soundtrack';
  }

  function setPlayingState(playing){
    localStorage.setItem(MUSIC_KEY, String(playing));
    updateButton(playing);
  }

  function savePlaybackTime(){
    if(Number.isFinite(audio.currentTime)){
      localStorage.setItem(MUSIC_TIME_KEY, String(audio.currentTime));
    }
  }

  function restorePlaybackTime(){
    const savedTime = Number(localStorage.getItem(MUSIC_TIME_KEY));
    if(Number.isFinite(savedTime) && savedTime >= 0){
      audio.currentTime = savedTime;
    }
  }

  audio.addEventListener('loadedmetadata', restorePlaybackTime, { once: true });
  audio.addEventListener('timeupdate', savePlaybackTime);
  audio.addEventListener('pause', savePlaybackTime);
  window.addEventListener('pagehide', savePlaybackTime);

  if(isFirstPage){
    localStorage.setItem(MUSIC_TIME_KEY, '0');
  }

  if(audio.readyState >= 1){
    restorePlaybackTime();
  }

  const shouldResume = localStorage.getItem(MUSIC_KEY) === 'true';

  if(shouldResume){
    audio.play().catch(() => {
      setPlayingState(false);
    });
    updateButton(true);
  } else {
    audio.pause();
    updateButton(false);
  }

  btn.addEventListener('click', async () => {
    const isPlaying = localStorage.getItem(MUSIC_KEY) === 'true';

    if(isPlaying){
      audio.pause();
      setPlayingState(false);
      return;
    }

    try {
      await audio.play();
      setPlayingState(true);
    } catch {
      setPlayingState(false);
      btn.textContent = 'Tap again to play the music 🎵';
    }
  });
})();
