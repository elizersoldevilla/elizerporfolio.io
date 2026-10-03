---
title: "CLEAR - Ethics Approval Tracking Platform"
description: "Role-based platform for tracking ethics applications, requirements, revisions, and committee approval progress"
longDescription: "CLEAR (Centralized Logging for Ethics Approval and Review) is a web platform that gives research applicants and the Institutional Ethics Review Committee (IERC) one shared record for every ethics application. Applicants sign in with their TUA Email and get a live six-stage timeline, a plain-language Next Action panel, and a Requirements and Revisions tracker. Committee members get a dashboard with live counts across every stage and a searchable Application Queue, so nothing sits unassigned or unnoticed."
image: "/images/portfolio/clear-3.jpg"
images:
  - "/images/portfolio/clear-1.jpg"
  - "/images/portfolio/clear-2.jpg"
  - "/images/portfolio/clear-3.jpg"
category: "web"
technologies:
  - "React"
  - "Next.js"
  - "Tailwind CSS"
featured: true
startDate: "2025-08-04"
endDate: "2026-05-20"
status: "completed"
highlights:
  - "Role-based workspaces for students and the IERC committee behind a single TUA Email sign-in"
  - "Six-stage submission timeline - Submitted, Received, Sent For Review, Received By Reviewer, Review Finalization, Decision Issued - with a recorded date per stage"
  - "Live status banner plus a contextual Next Action panel, so an applicant always knows where their request stands without chasing reviewers"
  - "Requirements and Revisions tracker surfacing completion state and the number of outstanding revisions"
  - "Committee dashboard with live counts for New Applications, Under Review, For Revision, Pending Decision and Approved"
  - "Searchable, filterable Application Queue showing reference ID, title, requester, assignee, status and last-updated time"
  - "Queue auto-refreshes every 30 seconds so reviewers pick up new requests without reloading"
challenges:
  - "Modelling a multi-stage review workflow where every transition has to be auditable and restricted to the correct role"
  - "Keeping the student view and the committee view consistent without duplicating state logic between them"
  - "Designing a reference-ID and status vocabulary that stays readable as request volume grows"
outcomes:
  - "Replaces scattered email threads and paper forms with one auditable record per request"
  - "Applicants can see the exact review stage of their submission at any time"
  - "The committee can triage the whole queue from one dashboard instead of chasing individual requests"
---