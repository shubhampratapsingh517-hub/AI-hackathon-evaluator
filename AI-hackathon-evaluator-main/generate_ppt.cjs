const Ppts = require('pptxgenjs');

async function createPresentation() {
  const pres = new Ppts();

  // Define Styles
  const BG_COLOR = '020205';
  const PRIMARY_COLOR = '06B6D4'; // Cyan
  const ACCENT_COLOR = 'A855F7';  // Purple
  const TEXT_COLOR = 'F1F5F9';
  const SECONDARY_TEXT = '94A3B8';

  // --- SLIDE 1: TITLE SLIDE ---
  const slide1 = pres.addSlide();
  slide1.background = { color: BG_COLOR };
  
  slide1.addText('AI HACKATHON EVALUATOR', {
    x: 0, y: '35%', w: '100%', h: 1,
    fontSize: 54, bold: true, color: PRIMARY_COLOR,
    fontFace: 'Orbitron', align: 'center',
    margin: 0
  });

  slide1.addText('Automating the Future of Competition Judging', {
    x: 0, y: '50%', w: '100%', h: 0.5,
    fontSize: 24, color: TEXT_COLOR,
    align: 'center', fontFace: 'Rajdhani'
  });

  slide1.addText('_______________________________________', {
    x: 0, y: '55%', w: '100%', align: 'center', color: ACCENT_COLOR
  });

  // --- SLIDE 2: PROBLEM STATEMENT ---
  const slide2 = pres.addSlide();
  slide2.background = { color: BG_COLOR };
  slide2.addText('The Problem Statement', {
    x: 0.5, y: 0.5, w: '90%', h: 0.8,
    fontSize: 36, bold: true, color: PRIMARY_COLOR, fontFace: 'Orbitron'
  });

  const problems = [
    { text: 'Manual Evaluation Inefficiency: Slow and labor-intensive judging for large events.' },
    { text: 'Subjectivity & Bias: Human judges may have inconsistent scoring metrics.' },
    { text: 'Lack of Real-time Insight: Participants stay in the dark about their progress.' },
    { text: 'Complexity in Technical Review: Hard to verify code quality and performance manually.' }
  ];

  slide2.addText(problems.map(p => p.text).join('\n\n'), {
    x: 1, y: 1.8, w: '80%', h: 3.5,
    fontSize: 20, color: SECONDARY_TEXT, bullet: true, fontFace: 'Rajdhani'
  });

  // --- SLIDE 3: PROPOSED SOLUTION ---
  const slide3 = pres.addSlide();
  slide3.background = { color: BG_COLOR };
  slide3.addText('Proposed Solution: AI-Judge', {
    x: 0.5, y: 0.5, w: '90%', h: 0.8,
    fontSize: 36, bold: true, color: ACCENT_COLOR, fontFace: 'Orbitron'
  });

  const solutions = [
    { text: 'Gemini AI Integration: Automated analysis of GitHub repos and live URLs.' },
    { text: 'Multi-Pillar Scoring: Evaluation across UI, Tech Depth, Innovation, and Speed.' },
    { text: 'Live Leaderboards: Real-time ranking updates using WebSockets.' },
    { text: 'Automated Feedback: Instant strengths and improvement tips for every team.' }
  ];

  slide3.addText(solutions.map(s => s.text).join('\n\n'), {
    x: 1, y: 1.8, w: '80%', h: 3.5,
    fontSize: 20, color: SECONDARY_TEXT, bullet: true, fontFace: 'Rajdhani'
  });

  // --- SLIDE 4: TECH STACK ---
  const slide4 = pres.addSlide();
  slide4.background = { color: BG_COLOR };
  slide4.addText('Core Architecture & Tech Stack', {
    x: 0.5, y: 0.5, w: '90%', h: 0.8,
    fontSize: 36, bold: true, color: PRIMARY_COLOR, fontFace: 'Orbitron'
  });

  // Frontend Col
  slide4.addText('Frontend', { x: 0.8, y: 1.8, w: 2.5, fontSize: 24, bold: true, color: ACCENT_COLOR });
  slide4.addText('React + Vite\nTypeScript\nTailwind CSS\nFramer Motion', { x: 0.8, y: 2.3, w: 3, fontSize: 18, color: TEXT_COLOR });

  // Backend Col
  slide4.addText('Backend', { x: 3.8, y: 1.8, w: 2.5, fontSize: 24, bold: true, color: ACCENT_COLOR });
  slide4.addText('Node.js\nExpress\nSocket.io\nMulter', { x: 3.8, y: 2.3, w: 3, fontSize: 18, color: TEXT_COLOR });

  // AI & Data Col
  slide4.addText('Intelligence', { x: 6.8, y: 1.8, w: 2.5, fontSize: 24, bold: true, color: ACCENT_COLOR });
  slide4.addText('Google Gemini AI\nMongoDB / SQLite\nJWT Auth', { x: 6.8, y: 2.3, w: 3, fontSize: 18, color: TEXT_COLOR });

  // --- SLIDE 5: THANK YOU ---
  const slide5 = pres.addSlide();
  slide5.background = { color: BG_COLOR };
  slide5.addText('THANK YOU', {
    x: 0, y: '40%', w: '100%', h: 1,
    fontSize: 48, bold: true, color: PRIMARY_COLOR, align: 'center', fontFace: 'Orbitron'
  });
  slide5.addText('Q&A Session', {
    x: 0, y: '55%', w: '100%', h: 0.5,
    fontSize: 20, color: TEXT_COLOR, align: 'center', fontFace: 'Rajdhani'
  });

  // Save the presentation
  const filename = 'AI_Hackathon_Evaluator_Presentation.pptx';
  await pres.writeFile({ fileName: filename });
  console.log(`✅ Presentation created: ${filename}`);
}

createPresentation().catch(err => {
  console.error('❌ Error creating PPT:', err);
  process.exit(1);
});
