# Ping Team Channels VS Code Extension - Development Plan

**Created:** September 21, 2025  
**Status:** Planning Phase  
**Priority:** Post-MVP Implementation

## 🎯 Vision

Transform the SlackClone project into a powerful VS Code extension that brings team channels and directory-based collaboration directly into the editor. This extension will differentiate itself from generic AI assistants by focusing on **team-centric, context-aware collaboration** within the development environment.

## 🚀 Core Value Proposition

- **In-Editor Team Collaboration**: Chat with teammates without leaving VS Code
- **Code-Aware Discussions**: Share and discuss code snippets with full syntax highlighting
- **Project Context**: Channel discussions tied to specific repositories/workspaces
- **Real-Time Sync**: Live updates across all team members' VS Code instances
- **Seamless Integration**: Leverage existing Ping backend infrastructure

## 📋 Extension Features (Planned)

### Phase 1: Foundation
- **Authentication**: Login to Ping account within VS Code
- **Channel Tree View**: Browse team channels in sidebar
- **Basic Chat**: Send/receive messages in channel panel
- **User Management**: View online team members

### Phase 2: Code Integration
- **Code Sharing**: Share selected code snippets to channels
- **Syntax Highlighting**: Rich code display in chat messages
- **File Context**: Auto-tag discussions with current file/project
- **Quick Actions**: Right-click → "Share to Channel"

### Phase 3: Advanced Features
- **Real-Time Collaboration**: Live cursor sharing and code annotations
- **Smart Notifications**: Context-aware alerts (e.g., mentions in relevant files)
- **Channel Discovery**: Auto-suggest channels based on current project
- **Integration Hub**: Connect with existing Ping web app

### Phase 4: Polish & Distribution
- **VS Code Marketplace**: Publish and maintain extension
- **User Onboarding**: Welcome flow and documentation
- **Performance Optimization**: Efficient API usage and caching
- **Analytics**: Usage tracking and improvement insights

## 🏗️ Technical Architecture

### Extension Structure
```
ping-team-channels/
├── package.json                 # Extension manifest
├── src/
│   ├── extension.ts            # Main activation point
│   ├── services/
│   │   └── pingApiService.ts   # Backend API integration
│   ├── providers/
│   │   ├── channelProvider.ts  # Tree view data provider
│   │   └── userProvider.ts     # User management
│   ├── panels/
│   │   └── channelChatPanel.ts # Webview panel for chat
│   ├── commands/
│   │   └── shareCode.ts        # Code sharing functionality
│   └── utils/
│       ├── auth.ts             # Authentication helpers
│       └── constants.ts        # Configuration constants
├── media/                      # Icons and assets
├── webview-ui/                 # React components for panels
└── test/                       # Extension tests
```

### Key VS Code APIs
- **TreeDataProvider**: Channel and user lists in sidebar
- **Webview**: Rich chat interface with React
- **Commands**: Context menu actions and palette commands
- **Authentication**: VS Code's built-in auth provider
- **GlobalState**: Persist user session and preferences
- **WebSocket**: Real-time message updates

### Backend Integration
- **Reuse Existing API**: Leverage current Ping backend endpoints
- **Adapt ApiService**: Port frontend/src/services/api.ts for VS Code environment
- **WebSocket Events**: Real-time channel updates and notifications
- **Authentication Flow**: OAuth or token-based auth with backend

## 📦 Key Package.json Configuration

```json
{
  "name": "ping-team-channels",
  "displayName": "Ping Team Channels",
  "description": "Team collaboration and chat directly in VS Code",
  "version": "0.1.0",
  "engines": { "vscode": "^1.74.0" },
  "categories": ["Other"],
  "activationEvents": ["onStartupFinished"],
  "main": "./out/extension.js",
  "contributes": {
    "views": {
      "explorer": [
        {
          "id": "pingChannels",
          "name": "Team Channels",
          "when": "ping.authenticated"
        }
      ]
    },
    "commands": [
      {
        "command": "ping.shareCode",
        "title": "Share to Channel",
        "category": "Ping"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "ping.shareCode",
          "when": "editorHasSelection && ping.authenticated",
          "group": "9_cutcopypaste"
        }
      ]
    }
  }
}
```

## 🛠️ Development Roadmap

### Prerequisites
1. Complete SlackClone MVP
2. Ensure backend API stability
3. Install VS Code extension development tools:
   ```bash
   npm install -g yo generator-code
   yo code  # Generate extension scaffold
   ```

### Phase 1 Implementation (Weeks 1-2)
- [ ] Scaffold extension with Yeoman generator
- [ ] Set up TypeScript build pipeline
- [ ] Implement basic authentication flow
- [ ] Create channel tree view provider
- [ ] Build simple chat webview panel
- [ ] Test with local Ping backend

### Phase 2 Implementation (Weeks 3-4)
- [ ] Add code sharing commands
- [ ] Implement syntax highlighting in chat
- [ ] Build file context detection
- [ ] Add right-click menu integration
- [ ] Enhance UI with React components

### Phase 3 Implementation (Weeks 5-6)
- [ ] Integrate WebSocket for real-time updates
- [ ] Add smart notification system
- [ ] Implement channel discovery features
- [ ] Build settings and preferences panel

### Phase 4 Implementation (Weeks 7-8)
- [ ] Performance optimization and caching
- [ ] Comprehensive testing suite
- [ ] User documentation and onboarding
- [ ] Prepare for Marketplace submission

## 🔧 Technical Implementation Notes

### Authentication Strategy
```typescript
// Store auth token in VS Code's global state
const token = await context.globalState.get('pingAuthToken');
if (!token) {
  // Trigger authentication flow
  await vscode.commands.executeCommand('ping.authenticate');
}
```

### API Service Adaptation
```typescript
// Adapt existing ApiService for VS Code environment
class PingApiService {
  private baseURL = 'http://localhost:8080/api';
  private token: string | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.token = context.globalState.get('pingAuthToken');
  }

  async getChannels(): Promise<Channel[]> {
    // Similar to frontend ApiService but with VS Code storage
  }
}
```

### WebSocket Integration
```typescript
// Real-time updates for channels
const ws = new WebSocket(`ws://localhost:8080/ws/channels/${channelId}`);
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  this.chatPanel.addMessage(message);
};
```

## 📊 Success Metrics

### Technical Metrics
- Extension activation time < 2 seconds
- Message delivery latency < 500ms
- Memory usage < 50MB
- VS Code Marketplace rating > 4.0 stars

### User Adoption Metrics
- Weekly active users
- Messages sent per user per day
- Code snippets shared per week
- User retention after 30 days

## 🚨 Potential Challenges & Solutions

### Challenge: VS Code API Limitations
**Solution**: Use webviews for complex UI, leverage extension host for data management

### Challenge: Real-time Performance
**Solution**: Implement efficient WebSocket management with connection pooling

### Challenge: User Onboarding
**Solution**: Built-in walkthrough API and progressive feature discovery

### Challenge: Backend Compatibility
**Solution**: Version API endpoints and maintain backward compatibility

## 📝 Future Enhancements

### Integration Opportunities
- **GitHub Integration**: Link channels to repositories and pull requests
- **Jira/Linear**: Connect tasks and discussions
- **Calendar**: Schedule team meetings from channel context
- **AI Assistant**: Integrate existing Pong features

### Advanced Features
- **Voice Channels**: Audio chat within VS Code
- **Screen Sharing**: Share terminal output or editor views
- **Collaborative Editing**: Real-time code collaboration
- **Team Analytics**: Code review metrics and team productivity insights

## 📚 Resources & References

### VS Code Extension Development
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### Current Codebase
- Backend API: `backend/Ping/src/main/java/com/hire_me/Ping/`
- Frontend Services: `frontend/src/services/api.ts`
- WebSocket Events: `backend/Ping/src/main/java/com/hire_me/Ping/*/ws/`

---

## 🎯 Next Steps (Post-MVP)

1. **Review and Validate**: Ensure backend APIs are stable and documented
2. **Scaffold Extension**: Use Yeoman generator to create initial structure
3. **Prototype Authentication**: Implement basic login flow with existing backend
4. **Build MVP Chat**: Create minimal viable chat interface
5. **Iterate and Improve**: Gather feedback from team and enhance features

**Remember**: This extension should complement, not compete with, existing collaboration tools. Focus on the unique value of **in-editor, code-aware team collaboration**.
