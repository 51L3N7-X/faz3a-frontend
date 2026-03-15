# Professional & Candidate Category Hierarchy Update

## Summary
Updated the professional and candidate creation and editing dialogs to support a 3-level category hierarchy instead of the previous 2-level system.

## Changes Made

### Previous Structure (2 Levels)
- **Main Branch** (single select)
- **Sub Branches** (multi-select)

### New Structure (3 Levels)

#### For Professionals (SERVICE type)
- **Main Category** (single select dropdown)
- **Sub Category** (single select dropdown)
- **Specializations/Sub-Sub Categories** (multi-select)

#### For Candidates (JOB type)
- **Main Category** (single select dropdown)
- **Department** (single select dropdown)
- **Job Positions** (multi-select)

## Files Modified

### Professionals

#### 1. CreateDialog.tsx
**Location:** `src/app/[locale]/dashboard/professionals/CreateDialog.tsx`

**Changes:**
- Added `useSubSubCategories` hook import
- Added state for `selectedSubCategoryId`
- Added fetching of sub-sub categories based on selected sub-category
- Updated category selection UI to show 3 levels:
  1. Main Category dropdown
  2. Sub Category dropdown (shown when main category is selected)
  3. Specializations multi-select (shown when sub category is selected)
- Updated reset logic to clear sub-category and sub-sub selections when parent changes

#### 2. EditDialog.tsx
**Location:** `src/app/[locale]/dashboard/professionals/EditDialog.tsx`

**Changes:**
- Added `useSubSubCategories` hook import
- Added `useEffect` import from React
- Added state for `selectedSubCategoryId`
- Added fetching of sub-sub categories based on selected sub-category
- Added `useEffect` to automatically determine the sub-category parent when editing
  - Note: This currently defaults to the first sub-category as a fallback since the API doesn't return parent category info
  - Users can manually adjust if needed
- Updated category selection UI to match CreateDialog (3 levels)
- Updated reset logic to clear sub-category and sub-sub selections when parent changes

### Candidates

#### 3. CreateDialog.tsx
**Location:** `src/app/[locale]/dashboard/candidates/CreateDialog.tsx`

**Changes:**
- Added `useSubSubCategories` hook import
- Added state for `selectedSubCategoryId`
- Added fetching of sub-sub categories (job positions) based on selected department
- Updated category selection UI to show 3 levels:
  1. Main Category dropdown
  2. Department dropdown (shown when main category is selected)
  3. Job Positions multi-select (shown when department is selected)
- Updated reset logic to clear department and job positions when parent changes

#### 4. EditDialog.tsx
**Location:** `src/app/[locale]/dashboard/candidates/EditDialog.tsx`

**Changes:**
- Added `useSubSubCategories` hook import
- Added `useEffect` import from React
- Added state for `selectedSubCategoryId`
- Added fetching of sub-sub categories (job positions) based on selected department
- Added `useEffect` to automatically determine the department parent when editing
  - Note: This currently defaults to the first department as a fallback since the API doesn't return parent category info
  - Users can manually adjust if needed
- Updated category selection UI to match CreateDialog (3 levels)
- Updated reset logic to clear department and job positions when parent changes

## User Experience

### Creating a Professional
1. Select a **Main Category** (e.g., "Home Services")
2. Select a **Sub Category** (e.g., "Plumbing")
3. Select one or more **Specializations** (e.g., "Residential Plumbing", "Commercial Plumbing", "Emergency Repairs")

### Editing a Professional
1. The form loads with the main category pre-selected
2. The sub-category is automatically determined (defaults to first available if parent info not in API)
3. The specializations (sub-sub categories) are pre-selected based on the professional's current categories
4. Users can change any level, with dependent levels resetting appropriately

### Creating a Candidate
1. Select a **Main Category** (e.g., "Technology")
2. Select a **Department** (e.g., "Software Development")
3. Select one or more **Job Positions** (e.g., "Frontend Developer", "Backend Developer", "Full Stack Developer")

### Editing a Candidate
1. The form loads with the main category pre-selected
2. The department is automatically determined (defaults to first available if parent info not in API)
3. The job positions (sub-sub categories) are pre-selected based on the candidate's current categories
4. Users can change any level, with dependent levels resetting appropriately

## API Integration

The implementation uses existing API endpoints:
- `getMainCategories()` - Fetches main categories (filtered by type: "SERVICE" for professionals, "JOB" for candidates)
- `getSubCategories(parentId)` - Fetches sub-categories/departments for a main category
- `getSubSubCategories(parentId)` - Fetches sub-sub categories/job positions for a sub-category/department

The final `categoryIds` array sent to the backend contains only the **sub-sub category IDs** (the leaf nodes), allowing:
- **Professionals** to have multiple specializations
- **Candidates** to apply for multiple job positions

## Known Limitations

~~1. **Edit Dialog Parent Detection**: When editing, the system doesn't have direct access to which sub-category/department the professional's/candidate's specializations/job positions belong to. The current implementation defaults to the first sub-category/department as a fallback.~~

**✅ RESOLVED**: The backend API has been enhanced to return both `parentCategoryId` (main category) and `subCategoryId` (sub-category/department) in the response. The edit dialogs now use these values directly for accurate pre-selection.

2. **Category Validation**: The form requires at least one specialization/job position to be selected, but this is enforced at the final level (sub-sub categories).

## Backend API Enhancements

The following changes were made to the backend to support the 3-level hierarchy:

### Professional & Candidate DTOs
- Added `subCategoryId` field to `ProfessionalDto` and `CandidateDto`
- Updated `parentCategoryId` description to clarify it represents the main category (grandparent)
- `subCategoryId` represents the sub-category/department (parent of selected items)

### Service Layer Updates
Both `professionals.service.ts` and `candidates.service.ts` were updated to:
- Calculate and return both `parentCategoryId` (grandparent) and `subCategoryId` (parent)
- Query the database to traverse the category hierarchy
- Return accurate parent information in all methods: `create`, `findOne`, `update`, and `findManyWithPagination`

### Frontend Type Updates
- Updated `Professional` and `Candidate` interfaces in `domain.types.ts` to include `subCategoryId: number | null`
- Simplified the `useEffect` hooks in EditDialog components to directly use the `subCategoryId` from the data object

## Testing Recommendations

### For Professionals
1. Test creating a new professional with all 3 levels
2. Test editing an existing professional to ensure categories load correctly
3. Test changing the main category and verify sub-category and specializations reset
4. Test changing the sub-category and verify specializations reset
5. Test selecting multiple specializations
6. Verify the API receives the correct category IDs (should be sub-sub category IDs only)

### For Candidates
1. Test creating a new candidate with all 3 levels
2. Test editing an existing candidate to ensure categories load correctly
3. Test changing the main category and verify department and job positions reset
4. Test changing the department and verify job positions reset
5. Test selecting multiple job positions
6. Verify the API receives the correct category IDs (should be sub-sub category IDs only)
