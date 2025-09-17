package com.hire_me.Ping.dms.controller;

import com.hire_me.Ping.dms.dto.DmCreateRequest;
import com.hire_me.Ping.dms.dto.DmParticipantRequest;
import com.hire_me.Ping.dms.dto.DmResponse;
import com.hire_me.Ping.dms.service.DmService;
// These imports bring in other classes we’ll use in this file.
// - DmCreateRequest: the data we need to create a new DM
// - DmParticipantRequest: the data we need to add a new participant
// - DmResponse: the data we send back when returning info about a DM
// - DmService: the service layer where the real business logic lives

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// These are Spring framework and Java library imports.
// - HttpStatus: lets us set HTTP response codes like 201 Created or 200 OK
// - The annotations (@RestController, @RequestMapping, etc.) come from Spring
// - List is a standard Java collection to hold multiple responses.


@RestController
// This tells Spring that this class is a REST Controller.
// REST Controller = handles HTTP requests (like GET, POST, DELETE) 
// and returns JSON responses to the client.

@RequestMapping("/api/dms")
// This means every endpoint (URL path) inside this controller
// will start with "/api/dms". 
// Example: GET /api/dms/123 would be handled by this class.

public class DmController {
    private final DmService service;
    // We declare a variable to hold a reference to our service layer.
    // The controller doesn’t do the work itself — it delegates to the service.

    public DmController(DmService service) {
        this.service = service;
    }
    // Constructor: Spring will "inject" the DmService into this controller.
    // This is called Dependency Injection — it gives this class the tools it needs 
    // without us manually creating objects.


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DmResponse create(@RequestBody DmCreateRequest req) {
        // @PostMapping = handles POST requests (client wants to create something).
        // @ResponseStatus(HttpStatus.CREATED) = return status 201 Created if successful.
        // @RequestBody means: take the JSON body from the request and map it into 
        // a DmCreateRequest object automatically.
        // Then we pass that request to the service to actually create the DM.

        return service.create(req);
        // The service does the work and returns a DmResponse (the new DM info).
        // The controller just hands that response back to the client.
    }


    @GetMapping("/{id}")
    public DmResponse get(@PathVariable("id") Long id) {
        // @GetMapping("/{id}") = handles GET requests to "/api/dms/{id}".
        // {id} is a path variable (part of the URL).
        // Example: GET /api/dms/5 would call this method with id = 5.

        return service.get(id);
        // Call the service to look up that DM by its ID and return the info as JSON.
    }


    @GetMapping("/user/{userId}")
    public List<DmResponse> listForUser(@PathVariable("userId") Long userId) {
        // This endpoint is GET /api/dms/user/{userId}.
        // It lists all DMs that a specific user is part of.
        // Example: GET /api/dms/user/10 returns all DMs for user with ID 10.

        return service.listForUser(userId);
        // Service returns a list of DmResponse objects, one for each DM the user is in.
    }


    @PostMapping("/{id}/participants")
    public DmResponse addParticipant(@PathVariable("id") Long id, @RequestBody DmParticipantRequest req) {
        // This is POST /api/dms/{id}/participants
        // It adds a new participant (user) into an existing DM.
        // - id = the DM conversation ID (from the path)
        // - req = JSON body containing the userId of the person to add

        return service.addParticipant(id, req);
        // Service adds the participant and returns the updated DM info.
    }


    @DeleteMapping("/{id}/participants/{userId}")
    public DmResponse removeParticipant(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        // This is DELETE /api/dms/{id}/participants/{userId}
        // It removes a user from a DM.
        // Example: DELETE /api/dms/7/participants/22 removes user 22 from DM 7.

        return service.removeParticipant(id, userId);
        // Service does the removal and returns the updated DM info.
    }
}