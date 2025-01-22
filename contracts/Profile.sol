// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ArtValley.sol";

contract Profile {
    struct UserProfile {
        address owner;
        string username;
        string name;
        uint256 totalArts;
    }

    mapping(address => UserProfile) public profiles; // Mapping of user address to profile
    ArtValley public artValley; // Instance of ArtValley contract

    event ProfileUpdated(address owner, string username, string name, uint256 totalArts);

    constructor(address _artValleyAddress) {
        artValley = ArtValley(_artValleyAddress);
    }

    // Create or update user profile
    function updateProfile(string memory _username, string memory _name) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");

        uint256 totalArts = artValley.getArtsByOwner(msg.sender).length;

        profiles[msg.sender] = UserProfile({
            owner: msg.sender,
            username: _username,
            name: _name,
            totalArts: totalArts
        });

        emit ProfileUpdated(msg.sender, _username, _name, totalArts);
    }

    // Get user profile details
    function getProfile(address _user) external view returns (UserProfile memory) {
        require(profiles[_user].owner != address(0), "Profile not found");
        return profiles[_user];
    }

    // Get all arts owned by the user (via ArtValley)
    function getArtsByUser(address _user) external view returns (ArtValley.Art[] memory) {
        return artValley.getArtsByOwner(_user);
    }

    // Edit the price of a specific art owned by the user
    function editArtPrice(uint256 _artId, uint256 _newPrice) external {
        ArtValley.Art memory art = artValley.getArtDetails(_artId);
        require(art.owner == msg.sender, "You are not the owner of this art");

        artValley.editPrice(_artId, _newPrice);
    }
}