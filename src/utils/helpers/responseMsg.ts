export const Msg = {
  // General
  SERVER_ERROR: `Internal server error`,
  SUCCESS: `Success`,
  VALIDATION_ERROR: `Validation failed`,
  BAD_REQUEST: `Bad request`,

  // User
  USER_REGISTER: `User registered successfully`,
  USER_LOGIN: `User logged in successfully`,
  USER_EXISTS: `User already exists`,
  USER_ALREADY_VERIFIED: `User Already verified`,
  USER_NOT_VERIFIED: `User not verified`,
  USER_NOT_FOUND: `User not found`,
  ACCOUNT_DEACTIVATED: `Account has been temporarily deactivated`,
  ACCOUNT_VERIFIED: `User account verified successfully.`,
  USER_FETCHED: `User fetched successfully`,
  USERS_FETCHED: `Users fetched successfully`,
  USER_DELETED: `User deleted successfully`,
  USER_UPDATED: `User updated successfully`,
  USER_ADDED: `User added successfully`,
  USER_INACTIVE: `User account is temporarily inactive`,

  // Authentication
  INVALID_CREDENTIALS: `Invalid Credentials`,
  LOGIN_SUCCESS: `Login successful`,
  LOGOUT_SUCCESS: `Logout successful`,
  UNAUTHORIZED: `Unauthorized access`,
  FORBIDDEN: `Access forbidden`,
  TOKEN_EXPIRED: `Token has expired`,
  TOKEN_INVALID: `Invalid token`,
  PASSWORD_CHANGED: `Password changed successfully`,
  PASSWORD_INCORRECT: `Incorrect password`,
  PASSWORD_OLD_INCORRECT: `Incorrect old password`,
  ENTERED_OLD_PASSWORD: `You have entered your old password. Please enter a new password`,

  // Data
  DATA_FETCHED: `Data fetched successfully`,
  DATA_GENERATED: `Data generated successfully`,
  DATA_NOT_FOUND: `No data found`,
  DATA_UPDATED: `Data updated successfully`,
  DATA_DELETED: `Data deleted successfully`,
  DATA_ADDED: `Data added successfully`,
  DATA_REQUIRED: `Data is required`,
  DATA_ALREADY_EXISTS: `Data  already exists`,
  DATA_IS_CLOSED: `Data is closed`,

  // Id
  ID_REQUIRED: `Id is required`,

  // file
  PDF_REQUIRED: `PDF file is required`,
  CSV_REQUIRED: `CSV file is required`,
  EXCEL_REQUIRED: `Excel file is required`,
  IMAGE_REQUIRED: `Image file is required`,
  FILE_REQUIRED: `File is required`,

  // Profile
  USERNAME_EXISTS: `Username already exists`,

  // OTP
  OTP_SENT: `The OTP has been successfully sent to your registered email. Please check your inbox.`,
  OTP_VERIFIED: `OTP verified successfully`,
  OTP_NOT_VERIFIED: `OTP not verified. Please verify OTP.`,
  OTP_EXPIRED: `OTP has expired`,
  OTP_INVALID: `Invalid or expired OTP`,
  OTP_RESENT: `OTP resent successfully`,
  OTP_LIMIT_EXCEEDED: `OTP request limit exceeded, please try again later`,
  OTP_NOT_FOUND: `OTP not found. Please request a new OTP.`,

  // Verification
  EMAIL_VERIFICATION_SENT: `The verification link has been successfully sent to your registered email. Please check your inbox.`,
  EMAIL_VERIFIED: `Email verified successfully`,
  EMAIL_SENT: `Email sent successfully`,
  EMAIL_RESET_PASSWORD_LINK_SENT: `Password reset link has been sent to your email.`,
  EMAIL_ALREADY_VERIFIED: `Email already verified`,
  PHONE_VERIFIED: `Phone number verified successfully`,
  PHONE_ALREADY_VERIFIED: `Phone number already verified`,

  // SELLER
  SELLER_NOT_FOUND: `Seller not found`,
  SELLER_UPDATED: `Seller updated successfully`,
  SELLER_UPDATE_FAILED: `Failed to update seller`,
  SELLER_PROFILE_FETCHED: `Seller profile fetched successfully`,

  // MECHANIC
  MECHANIC_NOT_FOUND: `Mechanic not found`,
  MECHANIC_UPDATED: `Mechanic updated successfully`,
  MECHANIC_UPDATE_FAILED: `Failed to update mechanic`,
  MECHANIC_PROFILE_FETCHED: `Mechanic profile fetched successfully`,
  MECHANICS_FETCHED: `Mechanics fetched successfully`,
  MECHANIC_FETCHED: `Mechanic fetched successfully`,
  MECHANICS_NOT_FOUND: `Mechanics not found`,

  // BUYER
  BUYER_NOT_FOUND: `Buyer not found`,
  BUYER_UPDATED: `Buyer updated successfully`,
  BUYER_UPDATE_FAILED: `Failed to update buyer`,
  BUYER_PROFILE_FETCHED: `Buyer profile fetched successfully`,

  // TOWER
  TOWER_NOT_FOUND: `Tower not found`,
  TOWERS_FETCHED: `Towers list fetched successfully`,
  TOWER_UPDATED: `Tower updated successfully`,
  TOWER_UPDATE_FAILED: `Failed to update tower`,
  TOWER_PROFILE_FETCHED: `Tower profile fetched successfully`,

  // DEALER
  DEALER_NOT_FOUND: `Dealer not found`,
  DEALER_UPDATED: `Dealer updated successfully`,
  DEALER_UPDATE_FAILED: `Failed to update dealer`,
  DEALER_PROFILE_FETCHED: `Dealer profile fetched successfully`,

  // LISTING
  LISTING_EXISTS: `Listing already exists`,
  LISTED_SUCCESSFULLY: `Seller listing created successfully`,
  LISTING_FETCHED: `Seller listing fetched successfully`,
  LISTING_NOT_FOUND: `Seller listing not found`,
  LISTING_DELETED: `Seller listing deleted successfully`,
  LISTING_UPDATED: `Seller listing updated successfully`,

  // SELLER REQUEST
  SELLER_REQUEST_CREATED: `Seller request created successfully`,
  SELLER_REQUEST_FETCHED: `Seller request fetched successfully`,
  SELLER_REQUESTS_FETCHED: `Seller requests fetched successfully`,
  SELLER_REQUEST_NOT_FOUND: `Seller request not found`,
  SELLER_REQUESTS_NOT_FOUND: `Seller requests not found`,
  SELLER_REQUEST_UPDATED: `Seller request updated successfully`,

  // BUYER REQUEST
  BUYER_CANCEL_REQUEST: `Buyer cancel request successfully`,
  BUYER_REQUEST_FETCHED: `Buyer request fetched successfully`,
  BUYER_REQUESTS_FETCHED: `Buyer requests fetched successfully`,
  BUYER_REQUEST_NOT_FOUND: `Buyer request not found`,
  BUYER_REQUESTS_NOT_FOUND: `Buyer requests not found`,
  BUYER_REQUEST_UPDATED: `Buyer request updated successfully`,
  BUYER_REQUEST_ALREADY_ACCEPTED: `Buyer request already accepted`,

  // Conversation
  CONVERSATION_CREATED: `Conversation created successfully`,
  CONVERSATION_FETCHED: `Conversation fetched successfully`,
  CONVERSATION_LIST_FETCHED: `Conversation list fetched successfully`,
  CONVERSATION_NOT_FOUND: `Conversation not found`,
  CONVERSATION_ALREADY_EXISTS: `Conversation already exists`,
  CONVERSATION_UPDATED: `Conversation updated successfully`,
  CONVERSATION_DELETED: `Conversation deleted successfully`,
  CONVERSATION_MARKED_AS_READ: `Conversation marked as read successfully`,

  // Chat
  CHAT_MESSAGE_CREATED: `Chat message created successfully`,
  CHAT_MESSAGE_FETCHED: `Chat message fetched successfully`,
  CHAT_MESSAGE_LIST_FETCHED: `Chat message list fetched successfully`,
  CHAT_MESSAGE_NOT_FOUND: `Chat message not found`,
  CHAT_MESSAGE_ALREADY_EXISTS: `Chat message already exists`,
  CHAT_MESSAGE_UPDATED: `Chat message updated successfully`,
  CHAT_MESSAGE_DELETED: `Chat message deleted successfully`,
  CHAT_MESSAGE_MARKED_AS_READ: `Chat message marked as read successfully`,
  CHAT_ALREADY_EXIST: `Chat already exists`,

  TARGET_USER_NOT_FOUND: `Target user not found`,
  ASSIGN_TO_USER_NOT_FOUND: `Assign to user not found`,

  // Message
  MESSAGE_UPDATED: `Message updated successfully`,
  MESSAGE_NOT_FOUND: `Message not found`,
  MESSAGES_NOT_FOUND: `Messages not found`,
  MESSAGE_DELETED: `Message deleted successfully`,
  MESSAGE_NOT_DELETED: `Message not deleted`,
  MESSAGE_CREATED: `Message created successfully`,
  MESSAGE_FETCHED: `Message fetched successfully`,
  MESSAGE_LIST_FETCHED: `Message list fetched successfully`,

  // Reserve Request
  RESERVE_REQUEST_CREATED: `Reserve request created successfully`,
  RESERVE_REQUEST_FETCHED: `Reserve request fetched successfully`,
  RESERVE_REQUESTS_FETCHED: `Reserve requests fetched successfully`,
  RESERVE_REQUEST_NOT_FOUND: `Reserve request not found`,
  RESERVE_REQUESTS_NOT_FOUND: `Reserve requests not found`,
  RESERVE_REQUEST_UPDATED: `Reserve request updated successfully`,
  RESERVE_REQUEST_ALREADY_EXISTS: `Reserve request already exists for this car`,

  // Buy Request
  BUY_REQUEST_CREATED: `Buy request created successfully`,
  BUY_REQUEST_FETCHED: `Buy request fetched successfully`,
  BUY_REQUESTS_FETCHED: `Buy requests fetched successfully`,
  BUY_REQUEST_NOT_FOUND: `Buy request not found`,
  BUY_REQUESTS_NOT_FOUND: `Buy requests not found`,
  BUY_REQUEST_UPDATED: `Buy request updated successfully`,
  BUY_REQUEST_ALREADY_EXISTS: `Buy request already exists for this car`,

  // Bid Offer
  BID_OFFER_CREATED: `Bid offer created successfully`,
  BID_OFFER_FETCHED: `Bid offer fetched successfully`,
  BID_OFFER_UPDATED: `Bid offer updated successfully`,
  BID_OFFER_DELETED: `Bid offer deleted successfully`,
  BID_OFFER_NOT_FOUND: `Bid offer not found`,
  BID_OFFER_ALREADY_EXISTS: `Bid offer already exists for this car`,
  BID_OFFER_ONLY_FOR_AUCTION: `Bid is allowed only for auction listings`,
  BID_OFFER_MIN_AMOUNT: `Bid amount must be greater than current bid`,
  BID_OFFER_ONLY_FOR_NON_AUCTION: `Offer is not allowed for auction listings`,
  BID_OFFERS_FETCHED: `Bid offers fetched successfully`,

  // Mechanic Inspection
  MECHANIC_INSPECTION_CREATED: `Mechanic inspection request created successfully`,
  MECHANIC_INSPECTION_FETCHED: `Mechanic inspection request fetched successfully`,
  MECHANIC_INSPECTIONS_FETCHED: `Mechanic inspection requests fetched successfully`,
  MECHANIC_INSPECTION_NOT_FOUND: `Mechanic inspection request not found`,
  MECHANIC_INSPECTIONS_NOT_FOUND: `Mechanic inspection requests not found`,
  MECHANIC_INSPECTION_UPDATED: `Mechanic inspection request updated successfully`,
  MECHANIC_INSPECTION_ALREADY_EXISTS: `Mechanic inspection request already exists for this car`,


  // Inspection
  INSPECTION_CREATED: `Inspection created successfully`,
  INSPECTION_FETCHED: `Inspection fetched successfully`,
  INSPECTION_UPDATED: `Inspection updated successfully`,
  INSPECTION_DELETED: `Inspection deleted successfully`,
  INSPECTION_NOT_FOUND: `Inspection not found`,
  INSPECTION_ALREADY_EXISTS: `Inspection already exists for this car`,
  
  // Mechanic Report
  MECHANIC_REPORT_SUBMITTED: `Mechanic report submitted successfully`,
  MECHANIC_REPORT_NOT_FOUND: `Mechanic report not found`,



  // Shipping Request
  SHIPPING_REQUEST_CREATED: `Shipping request created successfully`,
  SHIPPING_REQUEST_STATUS_UPDATED: `Shipping request status updated successfully`,
  SHIPPING_REQUEST_FETCHED: `Shipping request fetched successfully`,
  SHIPPING_REQUESTS_FETCHED: `Shipping requests fetched successfully`,
  SHIPPING_REQUEST_NOT_FOUND: `Shipping request not found`,
  SHIPPING_REQUESTS_NOT_FOUND: `Shipping requests not found`,
  SHIPPING_REQUEST_UPDATED: `Shipping request updated successfully`,
  SHIPPING_REQUEST_ALREADY_EXISTS: `Shipping request already exists for this car`,
  SHIPPING_PROVIDER_ASSIGNED_SUCCESSFULLY: `Shipping provider assigned successfully`,
};
