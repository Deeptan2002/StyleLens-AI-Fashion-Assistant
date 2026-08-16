# StyleDNA AI - Quick Start Guide

## 🎯 What This Does
StyleDNA AI is your AI-powered fashion assistant that provides:
- Virtual try-on using YouCam AI
- Personalized outfit recommendations
- Style DNA analysis based on your preferences

## ✅ Status: **READY FOR TESTING**

All backend and frontend integration is complete. Just add your API key and test!

---

## 🔑 Step 1: Add Your API Key

1. Create a file called `.env.local` in the root directory:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and replace the placeholder with your actual YouCam API key:
```
YOUCAM_API_KEY=your_actual_api_key_here
```

**Get your API key from:** https://yce.perfectcorp.com/ai-api

---

## 🚀 Step 2: Run the Application

```bash
# Make sure dependencies are installed
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🧪 Step 3: Test the Complete Flow

### Test Scenario 1: Full Happy Path
1. Open http://localhost:3000
2. Click "Get Started" or navigate to `/upload`
3. **Upload a selfie** (clear photo of face/upper body)
   - File uploads to Perfect Corp automatically
   - You'll see "Uploading..." while processing
4. **Choose wardrobe option** → "Upload Clothes"
5. **Upload a clothing item** (shirt, dress, jacket, etc.)
   - At least one item required for try-on demo
6. **Select an occasion** (e.g., "Office", "Party", "Casual")
7. **Choose preferences** (e.g., "Comfort", "Professional", "Trendy")
8. **Review and Start Analysis**
   - This creates the try-on task with Perfect Corp
   - Shows "Processing Style DNA..." with spinner
   - Polls for completion (may take 30 seconds - 2 minutes)
9. **View Result** - See your virtual try-on image!
   - Download the result
   - Try another outfit

### Test Scenario 2: Check Error Handling
- Try uploading without a selfie → Should show error
- Try analyzing without wardrobe → Should show error message
- Test with invalid image formats → Should validate

---

## 📊 What Happens Behind The Scenes

### When You Upload Selfie:
```
User uploads → FormData → /api/youcam/upload → Perfect Corp File API
→ Returns file_id → Stored in context
```

### When You Upload Wardrobe:
```
User uploads clothing → /api/youcam/upload → Perfect Corp File API
→ Returns file_id → Stored in context
```

### When You Start Analysis:
```
Click "Start Analysis" → /api/youcam/tryon (creates task)
→ Returns task_id → /api/youcam/task/[taskId] (polls status)
→ Task processing (2-120 seconds) → Returns result image
→ Displays in result page
```

---

## 🔍 Debugging

### Check API Key Configuration
```bash
# Verify .env.local exists and has your key
cat .env.local
```

### Check Server Logs
When you run `npm run dev`, watch the terminal for:
- ✅ Upload success messages
- ✅ Task creation logs
- ❌ Error messages with details

### Common Issues

**"Missing YOUCAM_API_KEY in .env.local"**
- Make sure `.env.local` file exists in the root directory
- Restart the dev server after creating/updating `.env.local`

**"Failed to upload file"**
- Check your API key is valid
- Ensure you have credits/quota on your YouCam account
- Check network connectivity

**"Failed to create try-on task"**
- Ensure both selfie and wardrobe have been uploaded successfully
- Check that file_ids are stored in context
- Verify API key has permissions for try-on endpoint

**"Task polling timeout"**
- Perfect Corp task took longer than 5 minutes (rare)
- Increase `MAX_POLL_ATTEMPTS` in `lib/youcam/pollTask.ts`
- Check Perfect Corp API status

---

## 📁 Project Structure

```
styledna-ai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── upload/
│   │   ├── page.tsx               # Selfie upload (integrated ✅)
│   │   └── wardrobe/
│   │       ├── page.tsx           # Choose wardrobe option
│   │       ├── photos/page.tsx    # Upload clothes (integrated ✅)
│   │       └── describe/page.tsx  # Describe wardrobe
│   ├── occasion/page.tsx          # Select occasion
│   ├── preferences/page.tsx       # Set preferences
│   ├── analysis/page.tsx          # Review & trigger AI (integrated ✅)
│   ├── result/page.tsx            # Display result (integrated ✅)
│   └── api/
│       ├── youcam/
│       │   ├── upload/route.ts    # Upload endpoint ✅
│       │   ├── tryon/route.ts     # Create task ✅
│       │   └── task/[taskId]/route.ts  # Poll task ✅
│       └── analyze/route.ts       # Orchestration ✅
├── lib/
│   └── youcam/
│       ├── config.ts              # API config ✅
│       ├── types.ts               # TypeScript types ✅
│       ├── uploadFile.ts          # Upload logic ✅
│       ├── createTask.ts          # Task creation ✅
│       ├── pollTask.ts            # Task polling ✅
│       └── index.ts               # Exports ✅
├── components/                     # UI components ✅
├── context/
│   └── OnboardingContext.tsx      # Global state ✅
├── types/
│   └── onboarding.ts              # Type definitions ✅
├── .env.local.example             # Template for env vars
└── .env.local                     # Your API keys (create this!)
```

---

## 🎨 Features Implemented

### ✅ Core Features
- [x] Selfie upload with preview
- [x] Wardrobe upload (photos)
- [x] Wardrobe description (UI complete)
- [x] Occasion selection
- [x] Style preferences
- [x] Perfect Corp file upload integration
- [x] Virtual try-on task creation
- [x] Async task polling with status
- [x] Result display with download
- [x] Complete error handling
- [x] Loading states
- [x] Responsive design

### 🔮 Future Enhancements (Optional)
- [ ] Multiple outfit options from single wardrobe
- [ ] AI-generated outfit suggestions
- [ ] Style scoring and recommendations
- [ ] Save favorite outfits
- [ ] Share results on social media
- [ ] Outfit history/gallery
- [ ] Client-side polling (non-blocking)

---

## 📖 API Documentation

### Perfect Corp APIs Used

**File Upload API**
```
POST https://yce-api-01.makeupar.com/s2s/v2.0/file/cloth-v3
Headers: { Authorization: Bearer {API_KEY} }
Body: { files: [{ file_name, file_size, content_type }] }
Returns: { file_id, pre-signed upload URL }
```

**Virtual Try-On API**
```
POST https://yce-api-01.makeupar.com/s2s/v3.0/task/cloth
Headers: { Authorization: Bearer {API_KEY} }
Body: { src_file_id, ref_file_id, garment_category: "auto" }
Returns: { task_id }
```

**Task Status API**
```
GET https://yce-api-01.makeupar.com/s2s/v3.0/task/cloth/{task_id}
Headers: { Authorization: Bearer {API_KEY} }
Returns: { task_status, result: { image_url } }
```

---

## 🎯 Testing Checklist

Before submitting to the hackathon, verify:

- [ ] `.env.local` is created with valid API key
- [ ] Dev server starts without errors
- [ ] Landing page loads correctly
- [ ] Selfie upload works and shows preview
- [ ] Selfie uploads to Perfect Corp (check Network tab)
- [ ] Wardrobe photo upload works
- [ ] Wardrobe uploads to Perfect Corp
- [ ] Occasion selection works
- [ ] Preferences selection works
- [ ] Analysis page shows all selections
- [ ] "Start Analysis" creates try-on task
- [ ] Loading spinner shows during processing
- [ ] Result page displays generated image
- [ ] Download button works
- [ ] Error messages show for missing data
- [ ] Mobile responsive design works

---

## 🏆 Hackathon Submission Notes

**Project Name:** StyleDNA AI

**Category:** YouCam API / Perfect Corp AI API Hackathon

**Tech Stack:**
- Next.js 16.2.10
- React 19.2.4
- TypeScript
- Tailwind CSS
- YouCam AI (Perfect Corp)
- Axios for API calls

**APIs Used:**
- Perfect Corp File Upload API
- Perfect Corp AI Clothes (Virtual Try-On)
- Perfect Corp Task Processing

**Key Features:**
- Complete end-to-end virtual try-on workflow
- User-friendly onboarding flow
- Real-time processing with loading states
- Professional UI/UX design
- Error handling and validation
- Mobile-responsive design

---

## 📞 Support

For Perfect Corp API issues, refer to:
- Documentation: https://docs.perfectcorp.com/
- AI API Portal: https://yce.perfectcorp.com/ai-api
- Competition Page: https://youcam-api.devpost.com/

---

**🎉 You're all set! Add your API key and start testing!**
