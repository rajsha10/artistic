// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArtValley {
    struct Art {
        uint256 id;
        string uri;
        address owner;
        uint256 price;
        uint256 likes;
        bool isForSale;
    }

    mapping(uint256 => Art) public arts; // Maps art ID to Art struct
    mapping(address => uint256[]) public ownerToArts; // Maps owner address to their art IDs
    uint256 public artCount;

    event ArtCreated(uint256 id, string uri, address owner, uint256 price);
    event ArtPurchased(uint256 id, address previousOwner, address newOwner, uint256 price);
    event PriceUpdated(uint256 id, uint256 newPrice);
    event ArtLiked(uint256 id, uint256 newLikes);
    event SaleToggled(uint256 id, bool isForSale);

    // Create new art and upload it onto the blockchain
    function createArt(string memory _uri, uint256 _price) external {
        require(bytes(_uri).length > 0, "Art URI cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        artCount++;
        arts[artCount] = Art(artCount, _uri, msg.sender, _price, 0, false);
        ownerToArts[msg.sender].push(artCount);

        emit ArtCreated(artCount, _uri, msg.sender, _price);
    }

    // Internal helper function to retrieve all arts
    function _getAllArts() internal view returns (Art[] memory) {
        Art[] memory allArts = new Art[](artCount);
        for (uint256 i = 1; i <= artCount; i++) {
            allArts[i - 1] = arts[i];
        }
        return allArts;
    }

    // External function to call from the frontend
    function getAllArts() external view returns (Art[] memory) {
        return _getAllArts();
    }

    // Get a single art's details
    function getArtDetails(uint256 _id) external view returns (Art memory) {
        require(arts[_id].id > 0, "Art not found");
        return arts[_id];
    }

    // Get all arts of a specific owner
    function getArtsByOwner(address _owner) external view returns (Art[] memory) {
        uint256[] memory ownerArts = ownerToArts[_owner];
        Art[] memory result = new Art[](ownerArts.length);
        for (uint256 i = 0; i < ownerArts.length; i++) {
            result[i] = arts[ownerArts[i]];
        }
        return result;
    }

    // Get the top-priced arts on the platform
    function getTopPricedArts() external view returns (Art[] memory) {
        Art[] memory allArts = _getAllArts();
        // Sort by price in descending order
        for (uint256 i = 0; i < allArts.length; i++) {
            for (uint256 j = i + 1; j < allArts.length; j++) {
                if (allArts[j].price > allArts[i].price) {
                    Art memory temp = allArts[i];
                    allArts[i] = allArts[j];
                    allArts[j] = temp;
                }
            }
        }
        return allArts;
    }

    // Buy art and transfer ownership
    function buyArt(uint256 _id) external payable {
        Art storage art = arts[_id];
        require(art.id > 0, "Art not found");
        require(art.isForSale, "Art is not for sale");
        require(msg.value >= art.price, "Insufficient payment");

        address previousOwner = art.owner;
        require(previousOwner != msg.sender, "Cannot buy your own art");

        // Transfer payment and ownership
        payable(previousOwner).transfer(msg.value);
        art.owner = msg.sender;
        art.isForSale = false;

        // Update ownership mappings
        removeArtFromOwner(previousOwner, _id);
        ownerToArts[msg.sender].push(_id);

        emit ArtPurchased(_id, previousOwner, msg.sender, art.price);
    }

    // Update price of art after ownership transfer
    function _updatePrice(uint256 _id, uint256 _newPrice) internal {
        Art storage art = arts[_id];
        require(art.id > 0, "Art not found");
        require(_newPrice > 0, "Price must be greater than zero");

        art.price = _newPrice;
        emit PriceUpdated(_id, _newPrice);
    }

    // External function to call from the frontend
    function updatePrice(uint256 _id, uint256 _newPrice) external {
        Art storage art = arts[_id];
        require(msg.sender == art.owner, "Only the owner can update the price");
        _updatePrice(_id, _newPrice);
    }

    // Edit price of art by current owner
    function editPrice(uint256 _id, uint256 _newPrice) external {
        require(msg.sender == arts[_id].owner, "Only the owner can edit the price");
        _updatePrice(_id, _newPrice);
    }

    // Toggle sale status
    function toggleForSale(uint256 _id) external {
        Art storage art = arts[_id];
        require(art.id > 0, "Art not found");
        require(msg.sender == art.owner, "Only the owner can toggle sale status");

        art.isForSale = !art.isForSale;
        emit SaleToggled(_id, art.isForSale);
    }

    // Increment likes on an art
    function likeArt(uint256 _id) external {
        Art storage art = arts[_id];
        require(art.id > 0, "Art not found");

        art.likes++;
        emit ArtLiked(_id, art.likes);
    }

    // Remove art from the previous owner's list
    function removeArtFromOwner(address _owner, uint256 _id) internal {
        uint256[] storage ownerArts = ownerToArts[_owner];
        for (uint256 i = 0; i < ownerArts.length; i++) {
            if (ownerArts[i] == _id) {
                ownerArts[i] = ownerArts[ownerArts.length - 1];
                ownerArts.pop();
                break;
            }
        }
    }
}
