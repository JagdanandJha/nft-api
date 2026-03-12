// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/**
 * @title UpgradableNFTV1
 * @notice Upgradeable ERC721 NFT with public mint and tokenURI input
 * @dev Uses UUPS proxy pattern and Ownable2Step access control
 */
contract UpgradableNFTV1 is
    ERC721URIStorageUpgradeable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    /// @dev Token ID counter
    uint256 private _nextTokenId;

    /// @notice Mint price per NFT
    uint256 public mintPrice;

    /// @notice Maximum supply
    uint256 public maxSupply;

    /**
     * @dev Storage gap for future upgrades
     * This allows new variables to be added in future contract versions
     * without shifting down storage in the inheritance chain.
     */
    uint256[50] private __gap;

    /**
     * @notice Emitted when NFT is minted
     */
    event Minted(address indexed user, uint256 tokenId, string tokenURI);

    /**
     * @notice Emitted when mint price changes
     */
    event PriceUpdated(uint256 newPrice);

    /**
     * @notice Emitted when funds are withdrawn
     */
    event Withdraw(address indexed owner, uint256 amount);

    /**
     * @notice Emitted when max supply updated
     */
    event MaxSupplyUpdated(uint256 newMaxSupply);

    /**
     * @dev Disable initializer on implementation contract
     */
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the contract
     */
    function initialize(
        string memory name_,
        string memory symbol_
    ) public initializer {
        __ERC721_init(name_, symbol_);
        __Ownable2Step_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        mintPrice = 1 ether; 
        maxSupply = 5;
        _nextTokenId = 1;
    }

    /**
     * @notice Mint NFT with custom metadata URI
     * @param uri Metadata URI for the NFT
     */
    function mint(string calldata uri, address _to) external payable nonReentrant {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_nextTokenId <= maxSupply, "Max supply reached");

        uint256 tokenId = _nextTokenId++;

        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, uri);

        emit Minted(_to, tokenId, uri);
    }

    /**
     * @notice Update mint price
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit PriceUpdated(newPrice);
    }

    /**
     * @notice Withdraw contract balance
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");

        emit Withdraw(owner(), balance);
    }

    /**
     * @notice Total NFTs minted
     */
    function totalMinted() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * @notice Increase the maximum NFT supply
     * @dev Only owner can increase supply and it cannot be lower than minted tokens
     * @param newMaxSupply New maximum supply value
     */
    function increaseMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply > maxSupply, "Must increase supply");
        require(newMaxSupply >= totalMinted(), "Below minted supply");

        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    /**
     * @dev Authorize contract upgrade
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
