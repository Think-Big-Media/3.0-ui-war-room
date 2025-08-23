#!/usr/bin/env node

/**
 * Create remaining feature issues in Linear for War Room project
 */

const LINEAR_API_KEY = process.env.LINEAR_API_KEY || 'lin_api_Bmz6HNg7d1JSvgUDBat52LY7xtdjHVtpfJE4j97Z';

async function createRemainingIssues() {
  const headers = {
    'Authorization': LINEAR_API_KEY,
    'Content-Type': 'application/json'
  };

  console.log('🚀 Creating remaining feature issues in Linear...\n');

  // Define the remaining issues
  const issues = [
    {
      title: "WebSocket Real-time Communication",
      description: `## Overview
Implement WebSocket connections for real-time updates in campaign dashboard and volunteer coordination.

## Technical Requirements
- Set up WebSocket endpoints in FastAPI using websockets library
- Implement client-side connection management in React
- Create real-time update patterns for campaign events
- Handle connection lifecycle (connect, disconnect, reconnect)
- Implement message queuing for offline scenarios

## Implementation Details
1. **Backend WebSocket Setup**
   - Create WebSocket manager class for connection pooling
   - Implement authentication for WebSocket connections
   - Set up broadcast patterns for room-based messaging
   - Add Redis pub/sub for multi-server support

2. **Frontend Integration**
   - Create custom React hooks for WebSocket management
   - Implement automatic reconnection with exponential backoff
   - Add connection status indicators
   - Handle message buffering during disconnections

3. **Real-time Features**
   - Live campaign dashboard metrics
   - Volunteer status updates
   - Event attendance tracking
   - Donation notifications
   - Chat/messaging system

## Acceptance Criteria
- [ ] WebSocket endpoints are implemented and documented
- [ ] Authentication is required for WebSocket connections
- [ ] React components can subscribe to real-time updates
- [ ] Connection failures are handled gracefully
- [ ] Messages are delivered reliably with acknowledgments
- [ ] Performance tested with 100+ concurrent connections
- [ ] Integration tests cover WebSocket functionality`,
      labels: ["feature", "backend", "frontend"],
      priority: 2 // Medium priority
    },
    {
      title: "Document Intelligence Integration",
      description: `## Overview
Complete the document analysis system with OpenAI and Pinecone for campaign document management.

## Technical Requirements
- Document upload with virus scanning
- OCR processing for scanned documents
- Vector embedding generation using OpenAI
- Semantic search with Pinecone
- AI-powered summarization and insights

## Implementation Details
1. **Document Processing Pipeline**
   - File upload endpoint with size/type validation
   - Virus scanning integration (ClamAV)
   - Text extraction (PDFs, Word docs, images)
   - Chunking strategy for large documents
   - Background job processing with Celery

2. **AI Integration**
   - OpenAI API integration for embeddings
   - Pinecone index management
   - Prompt engineering for document analysis
   - Cost optimization with caching
   - Rate limiting and error handling

3. **Search and Retrieval**
   - Semantic search interface
   - Faceted search with metadata filters
   - Relevance scoring and ranking
   - Search result highlighting
   - Export capabilities

## Features
- Document categorization (auto-tagging)
- Key information extraction
- Sentiment analysis for feedback documents
- Compliance checking
- Document versioning

## Acceptance Criteria
- [ ] Documents can be uploaded and processed
- [ ] OCR works for scanned documents
- [ ] Vector embeddings are generated and stored
- [ ] Semantic search returns relevant results
- [ ] AI summarization provides accurate insights
- [ ] Processing pipeline handles errors gracefully
- [ ] API endpoints are documented with examples
- [ ] Cost tracking is implemented for API usage`,
      labels: ["feature", "backend", "ai-agent"],
      priority: 2 // Medium priority
    },
    {
      title: "Volunteer Management System",
      description: `## Overview
Build comprehensive volunteer tracking, scheduling, and communication features.

## Core Features
1. **Volunteer Profiles**
   - Personal information management
   - Skills and expertise tracking
   - Availability preferences
   - Communication preferences
   - Background check status
   - Training certifications

2. **Scheduling System**
   - Shift creation and management
   - Volunteer self-scheduling
   - Automated shift reminders
   - Conflict detection
   - Recurring shift patterns
   - Integration with calendar apps

3. **Task Management**
   - Task assignment workflow
   - Skill-based matching
   - Priority and deadline tracking
   - Progress monitoring
   - Team collaboration features

4. **Communication Tools**
   - Bulk SMS/email capabilities
   - Targeted messaging based on skills/availability
   - Two-way communication
   - Message templates
   - Communication history tracking

## Technical Implementation
- RESTful API endpoints for all operations
- Real-time updates via WebSocket
- Mobile-responsive UI
- Offline capability for field operations
- Integration with Twilio/SendGrid
- Export functionality for reports

## Acceptance Criteria
- [ ] Volunteer profiles can be created and managed
- [ ] Skills and availability are trackable
- [ ] Shift scheduling system is functional
- [ ] Automated reminders are sent
- [ ] Task assignment workflow is implemented
- [ ] Bulk communication tools work reliably
- [ ] Hour tracking and reporting is accurate
- [ ] Mobile experience is optimized
- [ ] Data can be exported for analysis`,
      labels: ["feature", "backend", "frontend"],
      priority: 1 // High priority
    },
    {
      title: "Event Management Module",
      description: `## Overview
Create event creation, RSVP tracking, and attendance management system.

## Core Features
1. **Event Creation**
   - Event creation wizard with templates
   - Venue management and mapping
   - Capacity and ticketing options
   - Custom registration forms
   - Event page customization
   - Social media integration

2. **Registration System**
   - Online RSVP/registration
   - Payment processing (if needed)
   - Waitlist management
   - Group registrations
   - Custom fields and questions
   - Accessibility requirements

3. **Check-in System**
   - QR code generation for attendees
   - Mobile check-in app
   - On-site registration
   - Badge printing integration
   - Real-time attendance tracking
   - No-show notifications

4. **Event Analytics**
   - Registration metrics
   - Attendance patterns
   - Demographic analysis
   - Conversion tracking
   - Post-event surveys
   - ROI calculations

## Technical Requirements
- Calendar integration (Google, Outlook, Apple)
- Email/SMS confirmations and reminders
- Virtual event support (Zoom, Teams integration)
- Accessibility compliance (WCAG 2.1)
- Multi-language support
- API for third-party integrations

## Acceptance Criteria
- [ ] Events can be created with all details
- [ ] Custom RSVP forms can be built
- [ ] QR codes are generated for check-in
- [ ] Check-in process is smooth and fast
- [ ] Capacity limits are enforced
- [ ] Waitlist moves automatically
- [ ] Analytics dashboard shows key metrics
- [ ] Virtual event links are managed
- [ ] Confirmation emails are sent
- [ ] Data exports are available`,
      labels: ["feature", "backend", "frontend"],
      priority: 1 // High priority
    },
    {
      title: "Data Analytics Dashboard",
      description: `## Overview
Implement analytics dashboard with campaign metrics, volunteer performance, and donation tracking.

## Dashboard Components
1. **Campaign Overview**
   - Key performance indicators (KPIs)
   - Progress toward goals
   - Trend analysis
   - Comparative metrics
   - Real-time updates
   - Drill-down capabilities

2. **Volunteer Analytics**
   - Hours contributed
   - Task completion rates
   - Skill utilization
   - Retention metrics
   - Performance rankings
   - Engagement scores

3. **Financial Analytics**
   - Donation tracking
   - Donor segmentation
   - Revenue forecasting
   - Expense tracking
   - ROI analysis
   - Budget vs. actual

4. **Event Analytics**
   - Attendance metrics
   - Engagement rates
   - Conversion funnels
   - Geographic distribution
   - Demographic breakdowns
   - Historical comparisons

## Technical Implementation
- Chart.js or D3.js for visualizations
- Real-time data updates via WebSocket
- Responsive grid layout
- Customizable widgets
- Data export capabilities
- Scheduled report generation
- Role-based access control

## Advanced Features
- Predictive analytics using ML
- Anomaly detection
- Natural language insights
- Custom report builder
- API for external BI tools
- Mobile app with key metrics

## Acceptance Criteria
- [ ] Dashboard loads within 2 seconds
- [ ] All KPIs are accurately calculated
- [ ] Visualizations are interactive
- [ ] Date range filters work correctly
- [ ] Data can be exported to CSV/Excel
- [ ] Custom dashboards can be created
- [ ] Real-time updates work reliably
- [ ] Mobile view is fully functional
- [ ] Predictive models provide insights
- [ ] Performance is optimized for large datasets`,
      labels: ["feature", "frontend", "backend"],
      priority: 2 // Medium priority
    },
    {
      title: "Mobile Responsive Design",
      description: `## Overview
Ensure all components are fully responsive and optimized for mobile devices.

## Scope
1. **Component Audit**
   - Catalog all existing components
   - Test on various screen sizes
   - Identify responsive issues
   - Priority matrix for fixes

2. **Responsive Patterns**
   - Navigation (hamburger menu, bottom nav)
   - Forms (touch-friendly inputs)
   - Tables (horizontal scroll, card view)
   - Modals (full-screen on mobile)
   - Images (responsive, lazy loading)

3. **Touch Optimization**
   - Increase tap target sizes (min 44x44px)
   - Add touch gestures (swipe, pull-to-refresh)
   - Optimize scrolling performance
   - Prevent accidental interactions
   - Haptic feedback where appropriate

4. **Performance Optimization**
   - Reduce JavaScript bundle size
   - Implement code splitting
   - Optimize images and assets
   - Enable offline functionality
   - Minimize network requests

## PWA Features
- Service worker implementation
- Offline data caching
- App manifest for installation
- Push notifications
- Background sync
- Camera/location access

## Testing Requirements
- Device testing lab (iOS, Android)
- Browser testing (Safari, Chrome, Firefox)
- Performance testing on 3G/4G
- Accessibility testing
- Viewport testing (320px to 1920px)

## Acceptance Criteria
- [ ] All pages are responsive 320px-1920px
- [ ] Touch targets meet accessibility standards
- [ ] Forms are easy to use on mobile
- [ ] Navigation works well on all devices
- [ ] Performance scores 90+ on mobile
- [ ] PWA features are implemented
- [ ] Offline mode works correctly
- [ ] App can be installed on devices
- [ ] No horizontal scrolling issues
- [ ] Images load efficiently`,
      labels: ["frontend", "ui-ux"],
      priority: 1 // High priority
    },
    {
      title: "CI/CD Pipeline Setup",
      description: `## Overview
Configure GitHub Actions for automated testing, building, and deployment.

## Pipeline Components
1. **Pull Request Checks**
   - Automated test execution
   - Code quality checks (ESLint, Black)
   - Security scanning (Dependabot, Snyk)
   - Build verification
   - Preview deployments
   - Required status checks

2. **Main Branch Pipeline**
   - Full test suite execution
   - Coverage reporting
   - Build optimization
   - Docker image creation
   - Staging deployment
   - Smoke tests
   - Production deployment (manual approval)

3. **Quality Gates**
   - Minimum test coverage (80%)
   - No critical security issues
   - All tests passing
   - Build size limits
   - Performance benchmarks
   - Accessibility checks

4. **Deployment Process**
   - Blue-green deployments
   - Database migration checks
   - Health checks
   - Automatic rollback
   - Deployment notifications
   - Change tracking

## GitHub Actions Workflows
- **test.yml**: Runs on all PRs
- **build.yml**: Builds and publishes artifacts
- **deploy-staging.yml**: Deploys to staging
- **deploy-production.yml**: Production deployment
- **security-scan.yml**: Weekly security audits
- **performance-test.yml**: Nightly performance tests

## Infrastructure as Code
- Terraform for AWS resources
- Docker for containerization
- Kubernetes manifests
- Environment configurations
- Secrets management

## Monitoring Integration
- Deploy markers in monitoring tools
- Error tracking setup (Sentry)
- Performance monitoring (DataDog/New Relic)
- Log aggregation (CloudWatch/ELK)
- Uptime monitoring
- Alert configuration

## Acceptance Criteria
- [ ] PR checks run automatically
- [ ] Tests block merge if failing
- [ ] Coverage reports are generated
- [ ] Staging deploys on merge to main
- [ ] Production deploy requires approval
- [ ] Rollback process is documented
- [ ] All secrets are properly managed
- [ ] Deployment takes less than 10 minutes
- [ ] Monitoring alerts are configured
- [ ] Documentation is comprehensive`,
      labels: ["infrastructure", "deployment", "devops"],
      priority: 1 // High priority
    }
  ];

  // First, get the team ID
  const teamQuery = `
    query GetTeam {
      teams {
        nodes {
          id
          name
        }
      }
    }
  `;

  try {
    const teamResponse = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: teamQuery })
    });
    
    const teamResult = await teamResponse.json();
    const team = teamResult.data?.teams?.nodes?.[0];
    
    if (!team) {
      console.error('❌ No team found. Please create a team first.');
      return;
    }

    console.log(`📋 Using team: ${team.name}\n`);

    // Create each issue
    for (const issue of issues) {
      // Get label IDs
      const labelIds = [];
      for (const labelName of issue.labels) {
        const labelQuery = `
          query GetLabel {
            issueLabels(filter: { name: { eq: "${labelName}" } }) {
              nodes {
                id
                name
              }
            }
          }
        `;
        
        const labelResponse = await fetch('https://api.linear.app/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: labelQuery })
        });
        
        const labelResult = await labelResponse.json();
        const label = labelResult.data?.issueLabels?.nodes?.[0];
        if (label) {
          labelIds.push(label.id);
        }
      }

      // Create the issue
      const mutation = `
        mutation CreateIssue {
          issueCreate(input: {
            title: "${issue.title}",
            description: ${JSON.stringify(issue.description)},
            teamId: "${team.id}",
            priority: ${issue.priority},
            labelIds: ${JSON.stringify(labelIds)}
          }) {
            success
            issue {
              id
              identifier
              title
              url
            }
          }
        }
      `;

      const response = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: mutation })
      });
      
      const result = await response.json();
      
      if (result.data?.issueCreate?.success) {
        const createdIssue = result.data.issueCreate.issue;
        console.log(`✅ Created issue: ${createdIssue.identifier} - ${createdIssue.title}`);
        console.log(`   URL: ${createdIssue.url}\n`);
      } else {
        console.error(`❌ Failed to create issue: ${issue.title}`);
        if (result.errors) {
          console.error(result.errors);
        }
      }
    }

    console.log('\n✨ All remaining feature issues created successfully!');
    console.log('\nSummary of created issues:');
    console.log('- WebSocket Real-time Communication (Medium Priority)');
    console.log('- Document Intelligence Integration (Medium Priority)');
    console.log('- Volunteer Management System (High Priority)');
    console.log('- Event Management Module (High Priority)');
    console.log('- Data Analytics Dashboard (Medium Priority)');
    console.log('- Mobile Responsive Design (High Priority)');
    console.log('- CI/CD Pipeline Setup (High Priority)');
    console.log('\nNext steps:');
    console.log('1. Review and refine issue descriptions in Linear');
    console.log('2. Assign to team members or sprints');
    console.log('3. Add additional subtasks as needed');
    console.log('4. Set up dependencies between related issues');

  } catch (error) {
    console.error('❌ Error creating issues:', error);
  }
}

// Run the script
if (require.main === module) {
  createRemainingIssues().catch(console.error);
}