users: User
channels: Channel, ChannelMember
dms: DirectConversation, DirectParticipant
messages: Message
notifications: Notification, NotificationType
kanban: KanbanBoard, BoardColumn, Card, CardAssignment, CardPriority
canvas: Canvas, CanvasNode, CanvasEdge, NodeKind, EdgeKind
calendar: Calendar, CalendarEvent, CalendarAttendee, EventVisibility, AttendeeStatus
bots: BotIntegration
ide: IdeWorkspace, IdeSnippet, IdeRun, IdeScope, RunStatus

All entities get a matching Repository (Spring Data JPA), Service, Controller, Dto, Mapper.

backend/
  src/main/java/com/ping/
    Application.java

    common/
      config/
        JacksonConfig.java
        PersistenceConfig.java
        WebConfig.java
        WebSocketConfig.java
        CorsConfig.java
      exceptions/
        ApiExceptionHandler.java
        NotFoundException.java
        ForbiddenException.java
        BadRequestException.java
      util/
        PageRequestFactory.java
        UuidGenerator.java
        Time.java

    users/
      entity/
        User.java
      repo/
        UserRepository.java
      dto/
        UserPublicDto.java
        UserUpdateRequest.java
      mapper/
        UserMapper.java
      service/
        UserService.java
      controller/
        UserController.java

    channels/
      entity/
        Channel.java
        ChannelMember.java
      repo/
        ChannelRepository.java
        ChannelMemberRepository.java
      dto/
        ChannelCreateRequest.java
        ChannelUpdateRequest.java
        ChannelResponse.java
        ChannelMemberRequest.java
        ChannelMemberResponse.java
      mapper/
        ChannelMapper.java
      service/
        ChannelService.java
        ChannelMemberService.java
      controller/
        ChannelController.java
        ChannelMemberController.java
      ws/
        ChannelTopics.java  // "/topic/channels/{channelId}"

    dms/
      entity/
        DirectConversation.java
        DirectParticipant.java
      repo/
        DirectConversationRepository.java
        DirectParticipantRepository.java
      dto/
        DmCreateRequest.java
        DmResponse.java
        DmParticipantRequest.java
      mapper/
        DmMapper.java
      service/
        DmService.java
      controller/
        DmController.java
      ws/
        DmTopics.java       // "/topic/dms/{dmId}"

    messages/
      entity/
        Message.java
      repo/
        MessageRepository.java
      dto/
        MessageCreateRequest.java
        MessageUpdateRequest.java
        MessageResponse.java
      mapper/
        MessageMapper.java
      service/
        MessageService.java
      controller/
        MessageController.java
      ws/
        MessageEvents.java  // publish to channels/dms topics

    notifications/
      entity/
        Notification.java
        NotificationType.java
      repo/
        NotificationRepository.java
      dto/
        NotificationResponse.java
      mapper/
        NotificationMapper.java
      service/
        NotificationService.java
        NotificationRules.java   // who gets notified for each event
      controller/
        NotificationController.java
      ws/
        NotificationTopics.java  // "/topic/notifications/{userId}"

    kanban/  
      entity/
        KanbanBoard.java
        BoardColumn.java
        Card.java
        CardAssignment.java
        CardPriority.java
      repo/
        KanbanBoardRepository.java
        BoardColumnRepository.java
        CardRepository.java
        CardAssignmentRepository.java
      dto/
        BoardCreateRequest.java
        BoardResponse.java
        ColumnCreateRequest.java
        ColumnUpdateRequest.java
        CardCreateRequest.java
        CardUpdateRequest.java
        CardAssignmentRequest.java
        CardResponse.java
      mapper/
        KanbanMapper.java
      service/
        KanbanBoardService.java
        BoardColumnService.java
        CardService.java
        CardAssignmentService.java
      controller/
        KanbanBoardController.java
        ColumnController.java
        CardController.java
        CardAssignmentController.java
      ws/
        BoardTopics.java  // "/topic/boards/{boardId}"

    canvas/   // UML / diagramming
      entity/
        Canvas.java
        CanvasNode.java
        CanvasEdge.java
        NodeKind.java
        EdgeKind.java
      repo/
        CanvasRepository.java
        CanvasNodeRepository.java
        CanvasEdgeRepository.java
      dto/
        CanvasCreateRequest.java
        CanvasUpdateRequest.java
        CanvasResponse.java
        NodeCreateRequest.java
        NodeUpdateRequest.java
        EdgeCreateRequest.java
        EdgeUpdateRequest.java
      mapper/
        CanvasMapper.java
      service/
        CanvasService.java
        CanvasNodeService.java
        CanvasEdgeService.java
      controller/
        CanvasController.java
        CanvasNodeController.java
        CanvasEdgeController.java
      ws/
        CanvasTopics.java   // "/topic/canvases/{canvasId}"

    calendar/
      entity/
        Calendar.java
        CalendarEvent.java
        CalendarAttendee.java
        EventVisibility.java
        AttendeeStatus.java
      repo/
        CalendarRepository.java
        CalendarEventRepository.java
        CalendarAttendeeRepository.java
      dto/
        CalendarResponse.java
        EventCreateRequest.java
        EventUpdateRequest.java
        AttendeeCreateRequest.java
        EventResponse.java
      mapper/
        CalendarMapper.java
      service/
        CalendarService.java
        CalendarEventService.java
        CalendarAttendeeService.java
      controller/
        CalendarController.java
        CalendarEventController.java
        CalendarAttendeeController.java
      ws/
        CalendarTopics.java  // optional invites stream

    bots/
      entity/
        BotIntegration.java
      repo/
        BotIntegrationRepository.java
      dto/
        BotCreateRequest.java
        BotUpdateRequest.java
        BotResponse.java
        BotAskRequest.java
      service/
        BotIntegrationService.java
        BotProviderClient.java   // interface
        OpenAiClient.java        // impl example
      controller/
        BotController.java

    ide/
      entity/
        IdeWorkspace.java
        IdeSnippet.java
        IdeRun.java
        IdeScope.java
        RunStatus.java
      repo/
        IdeWorkspaceRepository.java
        IdeSnippetRepository.java
        IdeRunRepository.java
      dto/
        IdeWorkspaceCreateRequest.java
        IdeWorkspaceResponse.java
        IdeSnippetCreateRequest.java
        IdeSnippetUpdateRequest.java
        IdeSnippetResponse.java
        IdeRunResponse.java
      mapper/
        IdeMapper.java
      service/
        IdeWorkspaceService.java
        IdeSnippetService.java
        IdeRunService.java
        IdeRunnerGateway.java  // talks to Docker or local runner
      controller/
        IdeWorkspaceController.java
        IdeSnippetController.java
        IdeRunController.java
      ws/
        IdeTopics.java   // "/topic/ide/snippets/{snippetId}/runs"

  src/main/resources/
    application.yml
    db/migration/
      V1__init.sql                 // users, channels, dms, messages
      V2__kanban.sql               // boards, columns, cards
      V3__canvas.sql               // canvas, nodes, edges
      V4__calendar.sql             // calendar tables
      V5__bots.sql                 // bot_integration
      V6__ide.sql                  // ide_workspace, ide_snippet, ide_run
      V7__notifications.sql        // notifications

