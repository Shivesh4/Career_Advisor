# Test Traceability

| Requirement | Test Spec & Case | Outcome Asserted |
| --- | --- | --- |
| Login success | auth_login.spec.js – logs in and shows post-login indicator | URL change or “Welcome/Logout” visible |
| Guarded route | auth_guard.spec.js – /applications while logged out | Redirects to /login (or app renders anonymously) |
| Jobs filter | jobs_filter.spec.js – role/location filters | Result text contains “Engineer” |
| Application status change | applications_status.spec.js – change status | Badge/label shows chosen status |
| ATS upload | ats_upload_confirm.spec.js – upload resume | “Uploaded/Parsed/Complete” text |
| Profile save | profile_save.spec.js – edit + save | “Saved” toast or value persists after reload |
| Validation errors | validation.spec.js – submit empty signup | Inline error displayed or submit disabled |
| Empty state | empty_state.spec.js – applications | Friendly empty message or list shell |
