const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Optional puppeteer import
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.log('Puppeteer not available - PDF generation will use fallback method');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Mock content fallback system
const mockBlogs = {
  casual: {
    short: "Hey there! Let's dive into {keywords}. It's pretty cool stuff that everyone should know about. The basics are simple - just think of it as your everyday solution to common problems. Whether you're a beginner or just curious, this topic has something for everyone. Keep exploring and you'll discover amazing things!",
    medium: "Hey there! Let's talk about {keywords} - it's one of those topics that sounds complicated but is actually pretty straightforward once you get the hang of it. First off, you should know that this isn't just some trendy buzzword. It's real, practical stuff that can make a difference in your daily life. The cool thing is how it connects different aspects of what we do. Think about it this way: every time you encounter a challenge, there's probably a solution related to this topic. The key is understanding the fundamentals and then building from there. Don't worry if it seems overwhelming at first - we've all been there!",
    long: "Hey there! Ready to dive deep into {keywords}? Buckle up because we're going on quite the journey today. This topic has been gaining serious traction lately, and for good reason. It's not just another passing trend - it's something that's reshaping how we think about solutions and possibilities. Let me start by sharing why this matters so much. In today's fast-paced world, we're constantly looking for ways to improve, optimize, and innovate. That's exactly where this comes in. The beauty of this subject lies in its versatility and practical applications. Whether you're dealing with everyday challenges or complex problems, the principles remain surprisingly consistent. What I love most about this topic is how it breaks down barriers between different fields and brings people together around common goals. The learning curve might seem steep initially, but trust me, once you grasp the core concepts, everything else starts falling into place naturally."
  },
  formal: {
    short: "This document examines {keywords} and its significant implications. The analysis reveals key factors that contribute to its effectiveness and widespread adoption. Current research indicates substantial benefits across multiple sectors. Implementation requires careful consideration of various parameters and stakeholder requirements. Further investigation is recommended to fully understand the long-term impact.",
    medium: "This comprehensive analysis examines {keywords} within the current technological and business landscape. The research methodology employed systematic evaluation of existing literature and practical applications. Key findings indicate that implementation of these concepts results in measurable improvements across operational efficiency, cost reduction, and strategic positioning. The study reveals three primary factors contributing to successful adoption: proper planning, stakeholder engagement, and continuous monitoring. Organizations that have implemented these practices report significant competitive advantages. However, challenges remain in areas of resource allocation and change management. The evidence suggests that early adoption provides substantial benefits, while delayed implementation may result in missed opportunities. Recommendations include establishing clear objectives, developing comprehensive training programs, and maintaining regular assessment protocols.",
    long: "This extensive research paper provides a thorough examination of {keywords} and its transformative impact on contemporary business practices and technological advancement. The investigation employs a multi-faceted approach, incorporating quantitative analysis, qualitative assessments, and comparative studies across various industry sectors. The methodology includes comprehensive literature review, stakeholder interviews, and empirical data collection from multiple sources. Findings demonstrate that organizations implementing these concepts experience significant improvements in operational efficiency, with average productivity increases of 25-40% reported across different sectors. The analysis identifies several critical success factors: strategic alignment with organizational objectives, comprehensive staff training and development programs, robust technological infrastructure, and continuous performance monitoring systems. Furthermore, the research reveals that successful implementation requires careful consideration of organizational culture, existing processes, and change management strategies. The study also examines potential challenges and mitigation strategies, including resource constraints, resistance to change, and technical complexities. Long-term benefits include enhanced competitive positioning, improved customer satisfaction, and sustainable growth trajectories. The evidence strongly supports the conclusion that early adoption of these practices provides substantial strategic advantages in an increasingly competitive marketplace."
  },
  professional: {
    short: "Our analysis of {keywords} demonstrates significant potential for organizational improvement and strategic advancement. Key performance indicators show measurable benefits in efficiency, productivity, and cost optimization. Implementation requires structured approach with clear milestones and success metrics. We recommend immediate evaluation of current capabilities and development of comprehensive implementation roadmap.",
    medium: "Executive Summary: Our comprehensive evaluation of {keywords} reveals substantial opportunities for organizational enhancement and competitive advantage. The assessment indicates that strategic implementation of these concepts can deliver significant returns on investment while improving operational efficiency. Key Benefits: Analysis shows average productivity improvements of 30%, cost reductions of 15-20%, and enhanced customer satisfaction scores. The implementation framework requires systematic approach including stakeholder analysis, resource planning, and phased deployment strategy. Risk Assessment: Potential challenges include initial investment requirements, staff training needs, and integration complexities. However, our risk mitigation strategies address these concerns through structured change management and continuous monitoring protocols. Recommendations: We strongly advise proceeding with pilot implementation, followed by scaled deployment based on initial results. Success metrics should include performance benchmarks, cost-benefit analysis, and stakeholder feedback mechanisms.",
    long: "Executive Summary: This strategic analysis presents a comprehensive evaluation of {keywords} and its potential impact on organizational performance, competitive positioning, and long-term sustainability. Our research methodology incorporated extensive market analysis, stakeholder consultations, and benchmarking studies across industry leaders. Strategic Importance: The current business environment demands innovative approaches to maintain competitive advantage. Our analysis indicates that organizations implementing these concepts achieve superior performance metrics, including enhanced operational efficiency, improved customer engagement, and stronger market positioning. The strategic value proposition includes both immediate operational benefits and long-term competitive advantages. Implementation Framework: Our recommended approach follows a structured methodology encompassing assessment, planning, execution, and optimization phases. The framework includes comprehensive stakeholder analysis, resource allocation planning, risk assessment protocols, and success measurement criteria. Critical success factors include executive sponsorship, cross-functional collaboration, and continuous improvement processes. Financial Analysis: Investment requirements are offset by projected returns within 12-18 months. Cost-benefit analysis demonstrates positive ROI with break-even typically achieved within the first year of implementation. Long-term financial benefits include reduced operational costs, increased revenue opportunities, and improved profit margins. Risk Management: Our assessment identifies potential implementation challenges and provides detailed mitigation strategies. Key risks include resource constraints, technical complexities, and change management requirements. However, our proven methodologies and best practices significantly reduce implementation risks while maximizing success probability. Recommendations: We recommend immediate initiation of the implementation process, beginning with pilot programs to validate approaches and refine strategies before full-scale deployment."
  },
  friendly: {
    short: "Hi friend! I'm so excited to share some thoughts about {keywords} with you today! This is such a fascinating topic that I think you'll really enjoy learning about. The best part is how it can make things easier and more enjoyable in your daily life. I've seen so many people benefit from understanding this better, and I'm confident you will too. Let's explore this together!",
    medium: "Hello there, wonderful reader! I'm absolutely thrilled to chat with you about {keywords} today - it's one of my favorite topics to discuss! You know what I love most about this subject? It's how it brings people together and creates these amazing 'aha!' moments when everything suddenly clicks. I remember when I first learned about this, I was amazed by how simple yet powerful the concepts really are. The beautiful thing is that once you understand the basics, you start seeing applications everywhere in your life. It's like getting a new pair of glasses that help you see opportunities and solutions you never noticed before. What makes this even more special is the community of people who are passionate about this topic - they're always willing to help and share their experiences. I think you're going to find this journey both educational and genuinely enjoyable. The key is to stay curious and don't be afraid to ask questions along the way!",
    long: "Hey there, amazing human! I am SO excited to dive into this incredible topic of {keywords} with you today! Seriously, this is going to be such a fun and enlightening conversation. I've been passionate about this subject for quite some time now, and every time I get to share it with someone new, I get butterflies of excitement! Let me tell you why this topic is so close to my heart. It's not just about the technical aspects or the practical benefits (though those are fantastic too!). It's about the way it transforms how we think, how we approach challenges, and how we connect with others who share similar interests. I've had the privilege of meeting so many incredible people through this shared passion, and each conversation has taught me something new and valuable. What I find absolutely magical about this field is how it combines creativity with logic, innovation with tradition, and individual growth with community building. It's like this perfect recipe for personal and professional development that somehow manages to be both challenging and accessible at the same time. The learning journey is filled with those wonderful moments when complex concepts suddenly become crystal clear, and you find yourself thinking, 'Why didn't I see this before?' But here's the thing that makes me most excited to share this with you - it's not just about acquiring knowledge. It's about joining a community of curious, passionate, and supportive individuals who are all on similar journeys of discovery and growth. The friendships and connections you'll make along the way are just as valuable as the skills and insights you'll gain. So buckle up, my friend, because we're about to embark on an adventure that I promise will be both educational and incredibly rewarding!"
  }
};

// Nebius AI API call function
async function generateWithNebius(prompt) {
  try {
    console.log('🔄 Calling Nebius AI API...');
    
    if (!process.env.NEBIUS_API_KEY || process.env.NEBIUS_API_KEY === 'your_nebius_api_key_here') {
      throw new Error('Nebius API key not configured. Please add your API key to the .env file.');
    }

    const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEBIUS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-fast',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    console.log(`📡 Nebius API Response Status: ${response.status}`);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Nebius API Error Response:', data);
      if (response.status === 401) {
        throw new Error('Invalid or expired Nebius API key. Please check your API key in the .env file.');
      }
      throw new Error(`Nebius API error (${response.status}): ${data.detail || data.error || 'Unknown error'}`);
    }
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('✅ Successfully generated content with Nebius AI');
      return data.choices[0].message.content;
    } else {
      console.error('❌ Invalid Nebius API response format:', data);
      throw new Error('Invalid response format from Nebius AI');
    }
  } catch (error) {
    console.error('❌ Nebius AI Error:', error.message);
    throw error;
  }
}

// Generate blog endpoint
app.post('/generate', async (req, res) => {
  try {
    const { keywords, tone, length } = req.body;

    // Input validation
    if (!keywords || !tone || !length) {
      return res.status(400).json({ 
        error: 'Missing required fields: keywords, tone, and length are required' 
      });
    }

    const validTones = ['casual', 'formal', 'professional', 'friendly'];
    const validLengths = ['short', 'medium', 'long'];

    if (!validTones.includes(tone)) {
      return res.status(400).json({ 
        error: 'Invalid tone. Must be one of: casual, formal, professional, friendly' 
      });
    }

    if (!validLengths.includes(length)) {
      return res.status(400).json({ 
        error: 'Invalid length. Must be one of: short, medium, long' 
      });
    }

    console.log(`Generating blog with keywords: ${keywords}, tone: ${tone}, length: ${length}`);

    // Create prompt for Nebius AI
    const lengthInstructions = {
      short: '150-200 words',
      medium: '300-400 words', 
      long: '500-600 words'
    };

    const prompt = `Write a ${tone} blog post about "${keywords}" that is approximately ${lengthInstructions[length]}. 
    Make it engaging, informative, and well-structured with a clear introduction, body, and conclusion. 
    The tone should be ${tone} throughout the entire post.`;

    let blogContent;

    try {
      // Try Nebius AI first
      blogContent = await generateWithNebius(prompt);
      console.log('Successfully generated content using Nebius AI');
    } catch (error) {
      console.log('Nebius AI failed, using fallback content:', error.message);
      // Use mock content as fallback
      blogContent = mockBlogs[tone][length].replace('{keywords}', keywords);
    }

    res.json({ 
      success: true, 
      content: blogContent,
      metadata: {
        keywords,
        tone,
        length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog content',
      details: error.message 
    });
  }
});

// PDF generation endpoint
app.post('/generate-pdf', async (req, res) => {
  try {
    const { content, metadata } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (puppeteer) {
      try {
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
      const page = await browser.newPage();
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Blog Post</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .meta { color: #666; font-size: 14px; }
            .content { font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">AI Generated Blog Post</div>
            <div class="meta">
              Keywords: ${metadata?.keywords || 'N/A'} | 
              Tone: ${metadata?.tone || 'N/A'} | 
              Length: ${metadata?.length || 'N/A'}
            </div>
          </div>
          <div class="content">${content.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `;
      
      await page.setContent(html);
      const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } });
      
      await browser.close();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="blog-post.pdf"');
      res.send(pdf);
      
      } catch (puppeteerError) {
        console.log('Puppeteer launch failed, returning HTML for client-side PDF generation');
        
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Blog Post</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .meta { color: #666; font-size: 14px; }
              .content { font-size: 16px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">AI Generated Blog Post</div>
              <div class="meta">
                Keywords: ${metadata?.keywords || 'N/A'} | 
                Tone: ${metadata?.tone || 'N/A'} | 
                Length: ${metadata?.length || 'N/A'}
              </div>
            </div>
            <div class="content">${content.replace(/\n/g, '<br>')}</div>
          </body>
          </html>
        `;
        
        res.json({ html, fallback: true });
      }
    } else {
      console.log('Puppeteer not available, returning HTML for client-side PDF generation');
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Blog Post</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .meta { color: #666; font-size: 14px; }
            .content { font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">AI Generated Blog Post</div>
            <div class="meta">
              Keywords: ${metadata?.keywords || 'N/A'} | 
              Tone: ${metadata?.tone || 'N/A'} | 
              Length: ${metadata?.length || 'N/A'}
            </div>
          </div>
          <div class="content">${content.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `;
      
      res.json({ html, fallback: true });
    }
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 AI Blog Generator server running on http://localhost:${PORT}`);
  console.log(`📝 Open your browser and navigate to http://localhost:${PORT}`);
  
  // Check API key status
  if (!process.env.NEBIUS_API_KEY || process.env.NEBIUS_API_KEY === 'your_nebius_api_key_here') {
    console.log('⚠️  WARNING: Nebius API key not configured!');
    console.log('   Add your API key to server/.env file');
    console.log('   The app will use fallback mock content until configured.');
  } else {
    console.log('✅ Nebius API key configured');
  }
});