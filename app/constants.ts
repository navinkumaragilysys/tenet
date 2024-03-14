export const RESPONSE_TOPIC: string = "hotel-ops.ara.pms-agilysys.audit-log-response-events";

export const REQUEST_TOPIC: string = "hotel-ops.ara.pms-agilysys.audit-log-request-events";

export const INVALID_REQUEST_BODY: string = "Request body is not valid";

export const AUDIT_LOG_FAILED: string = "Audit Log failed!";

export const DATE_RANGE_ERROR: string = "Date range should not be more than 7 days";

export const FUTURE_DATE_ERROR: string = "Logs cannot be retrieved for Future Dates.";

export const AUDIT_LOG_FAILED_AT_PACKAGING: string = "auditLogHandler -> package :: Model is empty";

export const INVALID_FILTER: string = "`filter` is required";

export const Ext_Confirmation_Number: string = "External confirmation number not found";

export const PMS_Confirmation_Number: string = "PMS confirmation number not found";

export const AUDIT_LOG_FROM_DATE_REQUIRED: string = "`from` Date is required";

export const AUDIT_LOG_TO_DATE_REQUIRED: string = "`to` Date is required";

export const CHRONOLOGICAL_ORDER: string = "From DateTime must come before To DateTime";

export const KAFKA_REQ_NULL: string = "Kafka Request is null";

export const BEGIN_DATE_END_DATE_DIFFERENCE: string = "Being Date or End Date difference is more than 7 days";

export const BEGIN_DATE_END_DATE_NULL: string = "Being Date or End Date should not be Empty";

export const ACCOUNT_TYPE_ACCOUNT_NUMBER_NULL_OR_ENTITYS: string =
  "Account Type and Account Number should not be Empty or Entity Types should not be Empty";

export const PROPERTY_TENENT_CODE_ERROR: string = "Property ID/Tenent ID Not Found";

export const UNABLE_TO_PARSE_REQUESTBODY: string = "Unable to parse request body";

export const AUDIT_LOG_SOURCE: string = "/auditlog";

export const PACKAGE_FAILED: string = "auditLogHandler -> package :: Error while packaging the model";

export const ERROR_FETCHING_TENANT_PROPERTY_DETAIL: string = "External Property Code Not Found.";

export const EXTERNAL_PROPERTY_ID_NOT_FOUND: string = "External Property Code Not Found";

export const DEBUG: string = "DEBUG";

export const PROPERTY_ID_NOT_FOUND: string = "Property ID Not Found.";

export const TENANT_ID_NOT_FOUND: string = "Tenant ID Not Found.";

export const ACCOUNTNUMBER_OR_ACCOUNTTYPE_VISE_VERSA: string =
  "If Account Type is provided then Account Number is mandatory and vice versa";

export const VALID_ENTITY_TYPE: string = "Please Provide a Valid Entity Type.";

export const USER_NAME_NOT_FOUND: string = "User Name not found";

/**
 * The constant array representing the order of lines in case of ADD/Removed.
 * !IMPORTANT: The order of the array should be in the same order as the lines in the audit log.
 * If the order of the array is changed, the order of the lines in the audit log will also change.
 * @type {string[]}
 */
export const ADDRESSESLINEORDERCONSTANTS: string[] = [
  "line1",
  "line2",
  "line3",
  "line4",
  "line5",
  "city",
  "stateProvince",
  "postalCode",
  "country",
  "county"
];

/**
 * The constant array representing the order of lines in case of ADD/Removed.
 * !IMPORTANT: The order of the array will be in the same order as the lines in the audit log.
 * If the order of the array is changed, the order of the lines in the audit log will also change.
 * @type {string[]}
 */
export const ADDRESSLINEORDERCONSTANTS: string[] = [
  "addressLine1",
  "addressLine2",
  "addressLine3",
  "addressLine4",
  "addressLine5",
  "city",
  "stateProvince",
  "postalCode",
  "country",
  "county"
];

/**
 * changes log Path value for the audit log
 * !IMPORTANT: The order of the array will be in the same order as the lines in the audit log.
 */
export const AUDITLOGAPTHCONSTANTS = {
  CHANGES: [
    {
      type: "accountingDate",
      name: "Accounting Date",
      xl8: "rguest.stay.XL8__ACCOUNTING_DATE__0"
    },
    {
      type: "accountsReceivable",
      name: "Accounts Receivable",
      xl8: "rguest.stay.XL8__ACCOUNTS_RECEIVABLE__0"
    },
    {
      type: "agent",
      name: "Agent",
      xl8: "rguest.stay.XL8__AGENT__0"
    },
    {
      type: "animalType",
      name: "Animal Type",
      xl8: "rguest.stay.XL8__ANIMAL_TYPE__0"
    },
    {
      type: "autoRecurringItem",
      name: "Auto Recurring Item",
      xl8: "rguest.stay.XL8__AUTO_RECURRING_ITEM__0"
    },
    {
      type: "bed",
      name: "Bed",
      xl8: "rguest.stay.XL8__BED__0"
    },
    {
      type: "building",
      name: "Building",
      xl8: "rguest.stay.XL8__BUILDING__0"
    },
    {
      type: "cancellationPolicy",
      name: "Cancellation Policy",
      xl8: "rguest.stay.XL8__CANCELLATION_POLICY__0"
    },
    {
      type: "compReason",
      name: "Comp Reason",
      xl8: "rguest.stay.XL8__COMP_REASON__0"
    },
    {
      type: "comment",
      name: "Comment",
      xl8: "rguest.stay.reporting.XL8__COMMENT__0"
    },
    {
      type: "company",
      name: "Company",
      xl8: "rguest.stay.XL8__COMPANY__0"
    },
    {
      type: "customFieldsPropertySetup",
      name: "Custom Fields Property Setup",
      xl8: "rguest.stay.XL8__CUSTOM_FIELDS_PROPERTY_SETUP__0"
    },
    {
      type: "customFields",
      name: "Custom Fields",
      xl8: "rguest.stay.XL8__CUSTOM_FIELDS__0"
    },
    {
      type: "document",
      name: "Document",
      xl8: "rguest.stay.logging.XL8__DOCUMENT__0"
    },
    {
      type: "depositPolicy",
      name: "Deposit Policy",
      xl8: "rguest.stay.XL8__DEPOSIT_POLICY__0"
    },
    {
      type: "folioCustomization",
      name: "Folio Customization"
    },
    {
      type: "earlyDeparturePolicy",
      name: "Early Departure Policy",
      xl8: "rguest.stay.XL8__EARLY_DEPARTURE_POLICY__0"
    },
    {
      type: "featureSetting",
      name: "Feature Setting",
      xl8: "rguest.stay.settings.XL8__FEATURE_SETTING__0"
    },
    {
      type: "generalArea",
      name: "General Area",
      xl8: "rguest.stay.XL8__GENERAL_AREA__0"
    },
    {
      type: "generalAreaType",
      name: "General Area Type",
      xl8: "rguest.stay.XL8__GENERAL_AREA_TYPE__0"
    },
    {
      type: "group",
      name: "Group",
      xl8: "rguest.stay.XL8__GROUP__0"
    },
    {
      type: "guest",
      name: "Guest",
      xl8: "rguest.stay.XL8__GUEST__0"
    },
    {
      type: "guestType",
      name: "Guest Type",
      xl8: "rguest.stay.XL8__GUEST_TYPE__0"
    },
    {
      type: "guestSatisfactionEntries",
      name: "Guest Satisfaction Entry",
      xl8: "rguest.stay.XL8__GUEST_SATISFACTION_ENTRY__0"
    },
    {
      type: "guestSatisfactionCategory",
      name: "Guest Satisfaction category",
      xl8: "rguest.stay.XL8__GUEST_SATISFACTION_CATEGORY__0"
    },
    {
      type: "houseAccount",
      name: "House Account",
      xl8: "rguest.stay.XL8__HOUSE_ACCOUNT__0"
    },
    {
      type: "houseAccountCategory",
      name: "House Account Category",
      xl8: "rguest.stay.XL8__HOUSE_ACCOUNT_CATEGORY__0"
    },
    {
      type: "housekeepingRoomCondition",
      name: "Housekeeping Room Condition",
      xl8: "rguest.stay.XL8__HOUSEKEEPING_ROOM_CONDITION__0"
    },
    {
      type: "housekeepingSection",
      name: "Housekeeping Section",
      xl8: "rguest.stay.XL8__HOUSEKEEPING_SECTION__0"
    },
    {
      type: "inventoryBlock",
      name: "Inventory Block",
      xl8: "rguest.stay.XL8__INVENTORY_BLOCK__1"
    },
    {
      type: "inventoryItem",
      name: "Inventory Item",
      xl8: "rguest.stay.XL8__INVENTORY_ITEM__0"
    },
    {
      type: "lostItem",
      name: "Lost Item",
      xl8: "rguest.stay.XL8__LOST_ITEM__0"
    },
    {
      type: "marketChannel",
      name: "Market Channel",
      xl8: "rguest.stay.XL8__MARKET_CHANNEL__0"
    },
    {
      type: "marketSegment",
      name: "Market Segment",
      xl8: "rguest.stay.XL8__MARKET_SEGMENT__0"
    },
    {
      type: "mealPeriod",
      name: "Meal Period",
      xl8: "rguest.stay.XL8__MEAL_PERIOD__0"
    },
    {
      type: "occupancyStatus",
      name: "Occupancy Status",
      xl8: "rguest.stay.XL8__OCCUPANCY_STATUS__0"
    },
    {
      type: "otaInterface",
      name: "OTA Interface",
      xl8: "rguest.stay.XL8__OTA_INTERFACE__0"
    },
    {
      type: "outlet",
      name: "Outlet",
      xl8: "rguest.stay.XL8__OUTLET__0"
    },
    {
      type: "paymentInstrument",
      name: "Payment Instrument",
      xl8: "rguest.stay.XL8__PAYMENT_INSTRUMENT__0"
    },
    {
      type: "paymentGateway",
      name: "Payment Gateway",
      xl8: "rguest.stay.XL8__PAYMENT_GATEWAY__0"
    },
    {
      type: "paymentMethod",
      name: "Payment Method",
      xl8: "rguest.stay.XL8__PAYMENT_METHOD__0"
    },
    {
      type: "propertyDate",
      name: "Property Date",
      xl8: "rguest.stay.XL8__PROPERTY_DATE__0"
    },
    {
      type: "ratePlan",
      name: "Rate Plan",
      xl8: "rguest.stay.XL8__RATE_PLAN__0"
    },
    {
      type: "reservation",
      name: "Reservation",
      xl8: "rguest.stay.XL8__RESERVATION__0"
    },
    {
      type: "restrictivePermission",
      name: "Restrictive Permission",
      xl8: "rguest.stay.XL8__RESTRICTIVE_PERMISSION__0"
    },
    {
      type: "room",
      name: "Room",
      xl8: "rguest.stay.XL8__ROOM__1"
    },
    {
      type: "roomClass",
      name: "Room Class",
      xl8: "rguest.stay.XL8__ROOM_CLASS__0"
    },
    {
      type: "roomFeature",
      name: "Room Feature",
      xl8: "rguest.stay.XL8__ROOM_FEATURE__0"
    },
    {
      type: "roomFeatureCategory",
      name: "Room Feature Category",
      xl8: "rguest.stay.XL8__ROOM_FEATURE_CATEGORY__0"
    },
    {
      type: "roomInventoryStatus",
      name: "Room Inventory Status",
      xl8: "rguest.stay.XL8__ROOM_INVENTORY_STATUS__0"
    },
    {
      type: "roomType",
      name: "Room Type",
      xl8: "rguest.stay.XL8__ROOM_TYPE__0"
    },
    {
      type: "sharedReservation",
      name: "Shared Reservation",
      xl8: "rguest.stay.XL8__SHARED_RESERVATION__0"
    },
    {
      type: "storageLocation",
      name: "Storage Location",
      xl8: "rguest.stay.XL8__STORAGE_LOCATION__0"
    },
    {
      type: "sourceOfBusiness",
      name: "Source Of Business",
      xl8: "rguest.stay.XL8__SOURCE_OF_BUSINESS__0"
    },
    {
      type: "taxInvoiceSummary",
      name: "Tax Invoice Summary"
    },
    {
      type: "transactionCategory",
      name: "Transaction Category",
      xl8: "rguest.stay.XL8__TRANSACTION_CATEGORY__0"
    },
    {
      type: "transactionSubcategory",
      name: "Transaction Subcategory",
      xl8: "rguest.stay.XL8__TRANSACTION_SUBCATEGORY__0"
    },
    {
      type: "transactionItem",
      name: "Transaction Item",
      xl8: "rguest.stay.XL8__TRANSACTION_ITEM__0"
    },
    {
      type: "transportInfo",
      name: "Transport Information",
      xl8: "rguest.stay.settings.XL8__TRANSPORT_INFORMATION__0"
    },
    {
      type: "transportInfoSettings",
      name: "Transport Info Settings",
      xl8: "rguest.stay.settings.XL8__TRANSPORT_INFO_SETTINGS__0"
    },
    {
      type: "travelInfoSettings",
      name: "Travel Info Settings",
      xl8: "rguest.stay.settings.XL8__TRAVEL_INFO_SETTINGS__0"
    },
    {
      type: "travelLocation",
      name: "Travel Location",
      xl8: "rguest.stay.XL8__TRAVEL_LOCATION__0"
    },
    {
      type: "travelType",
      name: "Travel Type",
      xl8: "rguest.stay.settings.XL8__TRAVEL_TYPE__0"
    },
    {
      type: "vehicleType",
      name: "Vehicle Type",
      xl8: "rguest.stay.XL8__VEHICLE_TYPE__0"
    },
    {
      type: "vipStatus",
      name: "VIP Status",
      xl8: "rguest.stay.XL8__VIP_STATUS__0"
    }
  ],
  EVENTS: {
    Cancel: {
      id: "Cancel",
      name: "Cancel",
      xl8: "rguest.stay.XL8__CANCEL__0"
    },
    CheckIn: {
      id: "CheckIn",
      name: "Check-In",
      xl8: "rguest.stay.XL8__CHECK_IN__0"
    },
    CheckOut: {
      id: "CheckOut",
      name: "Checkout",
      xl8: "rguest.stay.XL8__CHECKOUT__0"
    },
    DateRoll: {
      id: "DateRoll",
      name: "Date Roll",
      xl8: "rguest.stay.XL8__DATE_ROLL__0"
    },
    EmailEvent: {
      id: "EmailEvent",
      name: "Email Event",
      xl8: "rguest.stay.reservation.XL8__EMAIL_EVENT__0"
    },
    GuestIdVerificationUpdated: {
      id: "GuestIdVerificationUpdated",
      name: "Guest Id Verification Updated",
      xl8: "rguest.stay.XL8__GUEST_ID_VERIFICATION_UPDATED__0"
    },
    Release: {
      id: "Release",
      name: "Release",
      xl8: "rguest.stay.XL8__RELEASE__0"
    },
    RetryDateRoll: {
      id: "RetryDateRoll",
      name: "Retry Date Roll",
      xl8: "rguest.stay.XL8__RETRY_DATE_ROLL__0"
    },
    UndoCancel: {
      id: "UndoCancel",
      name: "Undo Cancellation",
      xl8: "rguest.stay.XL8__UNDO_CANCELLATION__0"
    },
    UndoCheckIn: {
      id: "UndoCheckIn",
      name: "Undo Check-In",
      xl8: "XL8__UNDO_CHECK_IN__0"
    },
    UndoCheckOut: {
      id: "UndoCheckOut",
      name: "Undo Check-out",
      xl8: "XL8__UNDO_CHECK_OUT__0"
    },
    TransactionDisputed: {
      id: "TransactionDisputed",
      name: "Transaction disputed",
      xl8: "rguest.stay.XL8__TRANSACTION_DISPUTED__0"
    },
    TransactionDisputeResolved: {
      id: "TransactionDisputeResolved",
      name: "Transaction dispute resolved",
      xl8: "rguest.stay.XL8__TRANSACTION_DISPUTE_RESOLVED__0"
    },
    HousekeepingRoomConditionUpdatedEvent: {
      id: "HousekeepingRoomConditionUpdatedEvent",
      name: "Housekeeping RoomCondition Updated Event",
      xl8: "rguest.stay.XL8__HOUSEKEEPING_ROOMCONDITION_UPDATED_EVENT__0"
    },
    DiscrepantHousekeepingConditionUpdatedEvent: {
      id: "DiscrepantHousekeepingConditionUpdatedEvent",
      name: "Discrepant Housekeeping Condition Updated",
      xl8: "rguest.stay.XL8__DISCREPANT_HOUSEKEEPING_CONDITION_UPDATED__0"
    },
    HousekeepingConditionUpdatedEvent: {
      id: "HousekeepingConditionUpdatedEvent",
      name: "Housekeeping Condition Updated",
      xl8: "rguest.stay.XL8__HOUSEKEEPING_CONDITION_UPDATED__0"
    },
    LedgerTransactionOverrideEvent: {
      id: "LedgerTransactionOverrideEvent",
      name: "Non Refundable Refund",
      xl8: "rguest.stay.XL8__NON_REFUNDABLE_REFUND__0"
    }
  }
};
