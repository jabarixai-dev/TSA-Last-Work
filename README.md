TRIUMPHANT STANDARD ACADEMY — DEPLOYMENT NOTES

This package is a static Netlify site with Netlify Functions, Netlify Identity login, and Netlify Blobs for editable content/media.

Before using the admin dashboard:
1. Deploy the folder to Netlify.
2. Enable Netlify Identity for the site.
3. Invite the administrator account in Netlify Identity.
5. Keep the Identity/Git Gateway configuration enabled if you intend to use the existing Netlify CMS configuration.

Public pages do not require login. Content writes and media uploads require administrator authorization.

Forms:
- Contact form: Netlify Forms
- Admissions inquiry: Netlify Forms

The site does not include a build step; Netlify can publish the project directly.


## Site structure
The site no longer includes a School Fees page. Administration has its own page, and Programs We Offer covers Creche, Pre Nursery, Nursery, Primary School and Secondary School.
