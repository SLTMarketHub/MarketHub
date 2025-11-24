# Memory Leak Analysis for TMF620_Product_Catalog_API

## 🔍 Identified Memory Leak Issues

### 1. ⚠️ **CRITICAL: MongoDB Connection Not Properly Closed**
**Location:** `server.js` lines 71-76

**Issue:** 
- MongoDB connection is opened but never closed on graceful shutdown
- No connection pool limits configured
- Connection can accumulate over time

**Impact:** High - Can cause memory leaks and connection pool exhaustion

---

### 2. ⚠️ **MEDIUM: Buffer Accumulation in Image Storage**
**Location:** `controllers/productOfferingController.js` lines 263-281

**Issue:**
- Image buffers stored directly in MongoDB
- `toObject()` calls on documents with large buffers create duplicate objects in memory
- Multiple buffer copies during processing

**Impact:** Medium - Memory usage grows with large images and multiple uploads

---

### 3. ⚠️ **MEDIUM: Event Publisher Memory Accumulation**
**Location:** `services/eventPublisher.js` lines 15-17

**Issue:**
- Axios requests may accumulate if event hubs are down
- No request timeout or cleanup
- Failed requests might retain memory

**Impact:** Medium - Can accumulate memory if event hubs fail

---

### 4. ⚠️ **LOW: Multer Memory Storage**
**Location:** `routes/productOfferings.js` line 9

**Issue:**
- Uses `multer.memoryStorage()` - files kept in memory
- Multiple concurrent uploads can fill memory
- File limit is 5MB but no concurrent upload limit

**Impact:** Low-Medium - Multiple concurrent uploads can cause memory spikes

---

### 5. ⚠️ **LOW: toObject() Duplication**
**Location:** Multiple controllers

**Issue:**
- `toObject()` creates new plain JavaScript objects from Mongoose documents
- When called on documents with large attachments, creates duplicate buffers
- Multiple calls in same request path

**Impact:** Low - Temporary but can spike memory during request processing

---

## ✅ Recommendations & Fixes

See fixes implemented in the codebase to address these issues.

