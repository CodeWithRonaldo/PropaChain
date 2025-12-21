module propachain::propachain {
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use aptos_std::simple_map::{Self, SimpleMap};

    // ==================== Error Codes ====================
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_AMOUNT: u64 = 2;
    const E_PROPERTY_NOT_AVAILABLE: u64 = 3;
    const E_ALREADY_CONFIRMED: u64 = 4;
    const E_ALREADY_RESOLVED: u64 = 5;
    const E_NO_DISPUTE: u64 = 6;
    const E_RENTAL_NOT_EXPIRED: u64 = 7;
    const E_INVALID_LISTING_TYPE: u64 = 8;
    const E_ESCROW_NOT_CONFIRMED: u64 = 9;
    const E_DISPUTE_RAISED: u64 = 10;
    const E_PROFILE_NOT_FOUND: u64 = 11;
    const E_NOT_IN_ESCROW: u64 = 12;

    // ==================== Listing Type Constants ====================
    const LISTING_TYPE_SALE: u8 = 1;
    const LISTING_TYPE_RENT: u8 = 2;

    // ==================== Status Constants ====================
    const STATUS_AVAILABLE: u8 = 1;
    const STATUS_IN_ESCROW: u8 = 2;
    const STATUS_COMPLETED: u8 = 3;
    const STATUS_RENTED: u8 = 4;

    // ==================== Structs ====================

    /// Platform Admin Capability - Only for dispute resolution
    struct AdminCap has key {
        admin_address: address,
    }

    /// Global Registry to store user profiles
    struct ProfileRegistry has key {
        profiles: Table<address, UserProfile>,
    }

    /// User Profile with KYC details (stored in registry)
    struct UserProfile has store, drop, copy {
        wallet_address: address,
        full_name: String,
        government_id_type: String,
        government_id_number: String,
        phone_number: String,
        email: String,
        created_at: u64,
    }

    /// Property Listings Storage
    struct PropertyListingsStore has key {
        listings: SimpleMap<u64, PropertyListing>,
        next_id: u64,
    }

    /// Unified Property Listing (for both Sale and Rent)
    struct PropertyListing has store, drop, copy {
        id: u64,
        owner: address,
        listing_type: u8, // 1 = Sale, 2 = Rent
        
        // Pricing
        price: u64, // Sale price OR total rental amount
        monthly_rent: Option<u64>, // Only for rent
        rental_period_months: Option<u64>, // Only for rent
        deposit_required: Option<u64>, // Only for rent
        
        // Property Details
        property_address: String,
        property_type: String,
        description: String,
        
        // Media (IPFS Content IDs)
        documents_cid: Option<String>, // Only for sale
        images_cids: vector<String>,
        video_cid: String,
        
        // Status
        status: u8,
        locked_by: Option<address>,
        escrow_id: Option<u64>,
        created_at: u64,
        
        // Rental specific
        rental_start_date: Option<u64>,
        rental_end_date: Option<u64>,
    }

    /// Escrow Storage
    struct EscrowStore has key {
        escrows: SimpleMap<u64, Escrow>,
        next_id: u64,
    }

    /// Escrow for both Buy and Rent transactions
    struct Escrow has store, drop, copy {
        id: u64,
        listing_type: u8,
        property_id: u64,
        
        // Parties
        buyer_renter: address,
        seller_landlord: address,
        
        // Payment
        amount: u64,
        
        // Confirmations
        buyer_renter_confirmed: bool,
        seller_landlord_confirmed: bool,
        
        // Dispute
        dispute_raised: bool,
        dispute_raised_by: Option<address>,
        dispute_reason: String,
        
        // Receipt NFTs (for future implementation)
        buyer_renter_receipt_id: Option<u64>,
        seller_landlord_receipt_id: Option<u64>,
        
        // Status
        resolved: bool,
        created_at: u64,
    }

    /// Escrow Funds Storage (separate from Escrow data)
    struct EscrowFunds has key {
        funds: SimpleMap<u64, Coin<AptosCoin>>,
    }

    /// Property Receipt NFT
    struct PropertyReceipt has key, store, drop, copy {
        id: u64,
        listing_type: u8,
        timestamp: u64,
        
        // Property Info
        property_id: u64,
        property_address: String,
        property_type: String,
        
        // Parties
        buyer_renter_address: address,
        seller_landlord_address: address,
        
        // Payment
        amount_paid: u64,
        
        // For Rent Only
        rental_start_date: Option<u64>,
        rental_end_date: Option<u64>,
        rental_period_months: Option<u64>,
        monthly_rent: Option<u64>,
        
        // Metadata
        metadata_uri: String,
    }

    // ==================== Events ====================

    #[event]
    struct UserRegistered has drop, store {
        user_address: address,
        full_name: String,
        government_id_type: String,
        phone_number: String,
        email: String,
        timestamp: u64,
    }

    #[event]
    struct PropertyListed has drop, store {
        property_id: u64,
        owner: address,
        listing_type: u8,
        price: u64,
        property_address: String,
        timestamp: u64,
    }

    #[event]
    struct EscrowCreated has drop, store {
        escrow_id: u64,
        property_id: u64,
        listing_type: u8,
        buyer_renter: address,
        seller_landlord: address,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct PartyConfirmed has drop, store {
        escrow_id: u64,
        confirmer: address,
        is_buyer_renter: bool,
        timestamp: u64,
    }

    #[event]
    struct FundsReleased has drop, store {
        escrow_id: u64,
        property_id: u64,
        receiver: address,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct DisputeRaised has drop, store {
        escrow_id: u64,
        raised_by: address,
        reason: String,
        timestamp: u64,
    }

    #[event]
    struct DisputeResolved has drop, store {
        escrow_id: u64,
        winner: address,
        amount: u64,
        receipts_deleted: bool,
        timestamp: u64,
    }

    #[event]
    struct ReceiptMinted has drop, store {
        receipt_id: u64,
        recipient: address,
        listing_type: u8,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct RentalExpired has drop, store {
        property_id: u64,
        renter: address,
        landlord: address,
        timestamp: u64,
    }

    // ==================== Init Function ====================

    fun init_module(account: &signer) {
        let account_addr = signer::address_of(account);
        
        // Initialize admin capability
        move_to(account, AdminCap {
            admin_address: account_addr,
        });
        
        // Initialize profile registry
        move_to(account, ProfileRegistry {
            profiles: table::new(),
        });

        // Initialize property listings store
        move_to(account, PropertyListingsStore {
            listings: simple_map::create(),
            next_id: 1,
        });

        // Initialize escrow store
        move_to(account, EscrowStore {
            escrows: simple_map::create(),
            next_id: 1,
        });

        // Initialize escrow funds storage
        move_to(account, EscrowFunds {
            funds: simple_map::create(),
        });
    }

    // ==================== User Management Functions ====================

    public entry fun register_user(
        account: &signer,
        registry_addr: address,
        full_name: String,
        government_id_type: String,
        government_id_number: String,
        phone_number: String,
        email: String,
    ) acquires ProfileRegistry {
        let user_address = signer::address_of(account);
        let registry = borrow_global_mut<ProfileRegistry>(registry_addr);
        
        let profile = UserProfile {
            wallet_address: user_address,
            full_name,
            government_id_type,
            government_id_number,
            phone_number,
            email,
            created_at: timestamp::now_seconds(),
        };

        event::emit(UserRegistered {
            user_address,
            full_name: profile.full_name,
            government_id_type: profile.government_id_type,
            phone_number: profile.phone_number,
            email: profile.email,
            timestamp: profile.created_at,
        });

        table::add(&mut registry.profiles, user_address, profile);
    }

    // ==================== Property Listing Functions ====================

    public entry fun list_property(
        account: &signer,
        store_addr: address,
        listing_type: u8,
        price: u64,
        property_address: String,
        property_type: String,
        description: String,
        images_cids: vector<String>,
        video_cid: String,
        // Optional fields for sale
        documents_cid: Option<String>,
        // Optional fields for rent
        monthly_rent: Option<u64>,
        rental_period_months: Option<u64>,
        deposit_required: Option<u64>,
    ) acquires PropertyListingsStore {
        assert!(listing_type == LISTING_TYPE_SALE || listing_type == LISTING_TYPE_RENT, E_INVALID_LISTING_TYPE);

        let store = borrow_global_mut<PropertyListingsStore>(store_addr);
        let property_id = store.next_id;
        store.next_id = store.next_id + 1;

        let listing = PropertyListing {
            id: property_id,
            owner: signer::address_of(account),
            listing_type,
            price,
            monthly_rent,
            rental_period_months,
            deposit_required,
            property_address,
            property_type,
            description,
            documents_cid,
            images_cids,
            video_cid,
            status: STATUS_AVAILABLE,
            locked_by: option::none(),
            escrow_id: option::none(),
            created_at: timestamp::now_seconds(),
            rental_start_date: option::none(),
            rental_end_date: option::none(),
        };

        event::emit(PropertyListed {
            property_id,
            owner: listing.owner,
            listing_type,
            price,
            property_address: listing.property_address,
            timestamp: listing.created_at,
        });

        simple_map::add(&mut store.listings, property_id, listing);
    }

    // ==================== Escrow Functions ====================

    public entry fun deposit_to_escrow(
        account: &signer,
        store_addr: address,
        escrow_store_addr: address,
        property_id: u64,
        payment_amount: u64,
    ) acquires PropertyListingsStore, EscrowStore, EscrowFunds {
        let buyer_renter = signer::address_of(account);
        
        let property_store = borrow_global_mut<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &property_id);
        
        assert!(property.status == STATUS_AVAILABLE, E_PROPERTY_NOT_AVAILABLE);
        assert!(buyer_renter != property.owner, E_NOT_AUTHORIZED);
        assert!(payment_amount >= property.price, E_INVALID_AMOUNT);

        // Register for AptosCoin if not already registered
        if (!coin::is_account_registered<AptosCoin>(buyer_renter)) {
            coin::register<AptosCoin>(account);
        };

        // Withdraw payment from buyer
        let payment = coin::withdraw<AptosCoin>(account, payment_amount);

        property.status = STATUS_IN_ESCROW;
        property.locked_by = option::some(buyer_renter);

        // Create escrow
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow_id = escrow_store.next_id;
        escrow_store.next_id = escrow_store.next_id + 1;

        let escrow = Escrow {
            id: escrow_id,
            listing_type: property.listing_type,
            property_id,
            buyer_renter,
            seller_landlord: property.owner,
            amount: payment_amount,
            buyer_renter_confirmed: false,
            seller_landlord_confirmed: false,
            dispute_raised: false,
            dispute_raised_by: option::none(),
            dispute_reason: string::utf8(b""),
            buyer_renter_receipt_id: option::none(),
            seller_landlord_receipt_id: option::none(),
            resolved: false,
            created_at: timestamp::now_seconds(),
        };

        property.escrow_id = option::some(escrow_id);

        // Store payment in EscrowFunds
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        simple_map::add(&mut escrow_funds.funds, escrow_id, payment);

        event::emit(EscrowCreated {
            escrow_id,
            property_id,
            listing_type: property.listing_type,
            buyer_renter,
            seller_landlord: property.owner,
            amount: payment_amount,
            timestamp: escrow.created_at,
        });

        simple_map::add(&mut escrow_store.escrows, escrow_id, escrow);
    }

    public entry fun buyer_renter_confirms(
        account: &signer,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires EscrowStore, PropertyListingsStore, EscrowFunds {
        let caller = signer::address_of(account);
        
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(escrow.buyer_renter == caller, E_NOT_AUTHORIZED);
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(!escrow.buyer_renter_confirmed, E_ALREADY_CONFIRMED);
        assert!(!escrow.dispute_raised, E_DISPUTE_RAISED);

        escrow.buyer_renter_confirmed = true;

        event::emit(PartyConfirmed {
            escrow_id,
            confirmer: caller,
            is_buyer_renter: true,
            timestamp: timestamp::now_seconds(),
        });

        if (escrow.seller_landlord_confirmed) {
            release_funds_internal(escrow_store_addr, property_store_addr, escrow_id);
        };
    }

    public entry fun seller_landlord_confirms(
        account: &signer,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires EscrowStore, PropertyListingsStore, EscrowFunds {
        let caller = signer::address_of(account);
        
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(escrow.seller_landlord == caller, E_NOT_AUTHORIZED);
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(!escrow.seller_landlord_confirmed, E_ALREADY_CONFIRMED);
        assert!(!escrow.dispute_raised, E_DISPUTE_RAISED);

        escrow.seller_landlord_confirmed = true;

        event::emit(PartyConfirmed {
            escrow_id,
            confirmer: caller,
            is_buyer_renter: false,
            timestamp: timestamp::now_seconds(),
        });

        if (escrow.buyer_renter_confirmed) {
            release_funds_internal(escrow_store_addr, property_store_addr, escrow_id);
        };
    }

    fun release_funds_internal(
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires EscrowStore, PropertyListingsStore, EscrowFunds {
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(escrow.buyer_renter_confirmed && escrow.seller_landlord_confirmed, E_ESCROW_NOT_CONFIRMED);

        // Register seller for AptosCoin if needed
        if (!coin::is_account_registered<AptosCoin>(escrow.seller_landlord)) {
            // We can't register for them without their signer, so this will fail
            // In production, seller must be registered before transaction
            abort E_NOT_AUTHORIZED
        };

        // Extract payment and transfer to seller
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        let (_, payment) = simple_map::remove(&mut escrow_funds.funds, &escrow_id);
        let amount = coin::value(&payment);
        
        coin::deposit(escrow.seller_landlord, payment);

        let current_time = timestamp::now_seconds();

        // Update property status
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &escrow.property_id);

        if (escrow.listing_type == LISTING_TYPE_RENT) {
            // 30 days in seconds
            let seconds_in_month: u64 = 30 * 24 * 60 * 60;
            let rental_period = *option::borrow(&property.rental_period_months);
            let rental_duration = rental_period * seconds_in_month;
            
            property.rental_start_date = option::some(current_time);
            property.rental_end_date = option::some(current_time + rental_duration);
            property.status = STATUS_RENTED;
        } else {
            // For SALE: Transfer ownership to buyer
            property.owner = escrow.buyer_renter;
            property.status = STATUS_COMPLETED;
        };

        property.locked_by = option::none();
        property.escrow_id = option::none();

        escrow.resolved = true;

        event::emit(FundsReleased {
            escrow_id,
            property_id: escrow.property_id,
            receiver: escrow.seller_landlord,
            amount,
            timestamp: current_time,
        });
    }

    // ==================== Rental Expiration ====================

    public entry fun check_rental_expiration(
        property_store_addr: address,
        property_id: u64,
    ) acquires PropertyListingsStore {
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &property_id);
        
        assert!(property.listing_type == LISTING_TYPE_RENT, E_INVALID_LISTING_TYPE);
        assert!(property.status == STATUS_RENTED, E_NOT_IN_ESCROW);
        
        let end_date = *option::borrow(&property.rental_end_date);
        let current_time = timestamp::now_seconds();
        
        assert!(current_time >= end_date, E_RENTAL_NOT_EXPIRED);

        let renter = *option::borrow(&property.locked_by);
        
        property.status = STATUS_AVAILABLE;
        property.locked_by = option::none();
        property.rental_start_date = option::none();
        property.rental_end_date = option::none();

        event::emit(RentalExpired {
            property_id,
            renter,
            landlord: property.owner,
            timestamp: current_time,
        });
    }

    // ==================== Dispute Functions ====================

    public entry fun raise_dispute(
        account: &signer,
        escrow_store_addr: address,
        escrow_id: u64,
        reason: String,
    ) acquires EscrowStore {
        let caller = signer::address_of(account);
        
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(caller == escrow.buyer_renter || caller == escrow.seller_landlord, E_NOT_AUTHORIZED);
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(!escrow.dispute_raised, E_ALREADY_CONFIRMED);

        escrow.dispute_raised = true;
        escrow.dispute_raised_by = option::some(caller);
        escrow.dispute_reason = reason;

        event::emit(DisputeRaised {
            escrow_id,
            raised_by: caller,
            reason: escrow.dispute_reason,
            timestamp: timestamp::now_seconds(),
        });
    }

    public entry fun admin_resolve_dispute_release(
        account: &signer,
        admin_addr: address,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires AdminCap, EscrowStore, PropertyListingsStore, EscrowFunds {
        // Verify admin
        let admin_cap = borrow_global<AdminCap>(admin_addr);
        assert!(signer::address_of(account) == admin_cap.admin_address, E_NOT_AUTHORIZED);

        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(escrow.dispute_raised, E_NO_DISPUTE);

        // Register seller for AptosCoin if needed
        if (!coin::is_account_registered<AptosCoin>(escrow.seller_landlord)) {
            abort E_NOT_AUTHORIZED
        };

        // Extract and transfer payment
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        let (_, payment) = simple_map::remove(&mut escrow_funds.funds, &escrow_id);
        let amount = coin::value(&payment);
        
        coin::deposit(escrow.seller_landlord, payment);

        let current_time = timestamp::now_seconds();

        // Update property
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &escrow.property_id);

        if (escrow.listing_type == LISTING_TYPE_RENT) {
            let seconds_in_month: u64 = 30 * 24 * 60 * 60;
            let rental_period = *option::borrow(&property.rental_period_months);
            let rental_duration = rental_period * seconds_in_month;
            
            property.rental_start_date = option::some(current_time);
            property.rental_end_date = option::some(current_time + rental_duration);
            property.status = STATUS_RENTED;
        } else {
            property.owner = escrow.buyer_renter;
            property.status = STATUS_COMPLETED;
        };

        property.locked_by = option::none();
        property.escrow_id = option::none();

        escrow.resolved = true;

        event::emit(DisputeResolved {
            escrow_id,
            winner: escrow.seller_landlord,
            amount,
            receipts_deleted: false,
            timestamp: current_time,
        });
    }

    public entry fun admin_resolve_dispute_refund(
        account: &signer,
        admin_addr: address,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires AdminCap, EscrowStore, PropertyListingsStore, EscrowFunds {
        // Verify admin
        let admin_cap = borrow_global<AdminCap>(admin_addr);
        assert!(signer::address_of(account) == admin_cap.admin_address, E_NOT_AUTHORIZED);

        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(escrow.dispute_raised, E_NO_DISPUTE);

        // Extract and refund payment
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        let (_, refund) = simple_map::remove(&mut escrow_funds.funds, &escrow_id);
        let amount = coin::value(&refund);
        
        coin::deposit(escrow.buyer_renter, refund);

        // Update property
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &escrow.property_id);

        property.status = STATUS_AVAILABLE;
        property.locked_by = option::none();
        property.escrow_id = option::none();

        escrow.resolved = true;

        event::emit(DisputeResolved {
            escrow_id,
            winner: escrow.buyer_renter,
            amount,
            receipts_deleted: false,
            timestamp: timestamp::now_seconds(),
        });
    }

    // ==================== View/Getter Functions ====================

    #[view]
    public fun get_user_profile(registry_addr: address, user_address: address): UserProfile acquires ProfileRegistry {
        let registry = borrow_global<ProfileRegistry>(registry_addr);
        assert!(table::contains(&registry.profiles, user_address), E_PROFILE_NOT_FOUND);
        *table::borrow(&registry.profiles, user_address)
    }

    #[view]
    public fun has_profile(registry_addr: address, user_address: address): bool acquires ProfileRegistry {
        let registry = borrow_global<ProfileRegistry>(registry_addr);
        table::contains(&registry.profiles, user_address)
    }

    #[view]
    public fun get_property(store_addr: address, property_id: u64): PropertyListing acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        *simple_map::borrow(&store.listings, &property_id)
    }

    #[view]
    public fun get_escrow(store_addr: address, escrow_id: u64): Escrow acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        *simple_map::borrow(&store.escrows, &escrow_id)
    }

    #[view]
    public fun get_property_status(store_addr: address, property_id: u64): u8 acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.status
    }

    #[view]
    public fun is_escrow_resolved(store_addr: address, escrow_id: u64): bool acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        escrow.resolved
    }

    #[view]
    public fun get_property_owner(store_addr: address, property_id: u64): address acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.owner
    }

    #[view]
    public fun get_property_price(store_addr: address, property_id: u64): u64 acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.price
    }
}