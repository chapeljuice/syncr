////////////////
//  syncr js  //
////////////////

var syncr = {

	///////////////
	// variables //
	///////////////

	// contain the number of the new list being made
	newListNumber: '',
	// contains the name of the new list
	newListName: '',
	// contains the number of lists in the app
	numberOfLists: '',
	// get the number of items in the current list
	numberOfListItems: '',
	// current list the user is interacting with
	currentList: '',
	// current item the user is interacting with
	currentItem: '',
	currentItemName: '',
	// store touch coordinates & info
	touchDown: '',
	touchUp: '',
	touchDifference: '',
	touchType: '',
	touchDirection: '',

	//////////////////////////////////
	//  init and general functions  //
	//////////////////////////////////

	initialize: function () {

		syncr.numberOfLists = $( '.created-lists li' ).length;

		// if there aren't any lists, help the user out
		if ( syncr.numberOfLists === 0 ) {

			syncr.openModal( 'create-modal', 'welcome-text' );
			$( '#createInput' ).focus();
		}
	},


	///////////////////////////
	//  menu-view functions  //
	///////////////////////////

	// open the menu
	openMenu: function () {
		window.location.hash = '#menuView';
		$( '.menu-icon a' )
			.toggleClass( 'closed opened' );
		$( '.close-menu' )
			.removeClass( 'hide' );
	},

	// close the menu
	closeMenu: function () {
		window.location.hash = '#';
		$( '.menu-icon a' )
			.toggleClass( 'closed opened' );
		$( '.close-menu' )
			.addClass( 'hide' );
	},


	///////////////////////////////
	//  list-specific functions  //
	///////////////////////////////

	// change the list the user is viewing
	changeLists: function ( newList ) {

		// make the list the user selects the active list, and hide the rest of the list titles
		$( '#pickList-' + newList )
			.addClass( 'active' )
			.siblings().addClass( 'hide' );
		$( '.created-lists' )
			.addClass( 'closed' )
			.removeClass( 'opened' );

		// show the items of the list the user is opening
		$( '#list-' + newList )
			.removeClass( 'hide' )
			.addClass( 'active' );

		// hide the list info tip
		$( '.list-info' )
			.addClass( 'hide' );
	},

	// clear all the items of the current list
	clearList: function () {

			// clear out all their list items
			$( '.list.active' )
				.html( '<li class="add-new-item">+ New item</li>' );

			syncr.closeModal();
			// and close the menu
			syncr.closeMenu();

	},

	// create a new list
	createList: function () {

		// set var to be what number the new list will be
		syncr.newListNumber = $( '.list' ).length + 1;

		if ( $( '#createInput' ).val() !== '' ) {
			syncr.newListName = $( '#createInput' ).val();
		} else {
			syncr.newListName = 'List #' + syncr.newListNumber;
		}

		$( '.active' )
			.toggleClass( 'active hide' );

		$( '.created-lists ol' )
			.append( '<li class="active" id="pickList-' + syncr.newListNumber + '">' + syncr.newListName + '</li>' );

		$( '<ol class="list active" id="list-' + syncr.newListNumber + '">' +
				'<li class="add-new-item">+ New item</li>' +
			'</ol>' )
			.insertBefore( '.close-menu' );

		syncr.closeModal();
		syncr.closeMenu();

	},

	// delete the current list
	deleteList: function () {

		// delete the current list
		$( '.list.active' )
			.remove();

		// delete the current list title
		$( '.created-lists .active' )
			.remove();

		syncr.numberOfLists = $( '.created-lists li' ).length;

		// check to see if there are any lists left over
		if ( syncr.numberOfLists > 0 ) {

			// if there are, view the fist one
			$( '.created-lists li:first-child' )
				.addClass( 'active' )
				.removeClass( 'hide' );
			$( '.list' )
				.first()
				.addClass( 'active' )
				.removeClass( 'hide' );

		} else {

			// if there are not, make a new default one
			$( '.created-lists ol' )
				.html( '<li class="active" id="pickList-1">List 1</li>' );
			$( '<ol class="list active" id="list-1">' +
					'<li class="add-new-item">+ New item</li>' +
				'</ol>' )
				.insertBefore( '.close-menu' );

		}

		syncr.closeModal();
		syncr.closeMenu();

	},

	// opens the list of lists
	openLists: function () {

		// show all the lists available
		$( '.created-lists' )
			.addClass( 'opened' )
			.removeClass( 'closed' );
		$( '.created-lists li' ).removeClass( 'hide active' );

		// show the list info tip
		$( '.list-info' )
			.removeClass( 'hide' );

		// hide the items from the list the user was just viewing
		$( '.list' )
			.removeClass( 'active' )
			.addClass( 'hide' );

		// when the user selects a list to open...
		$( 'header' ).on( 'click', '.opened li', function () {
			// get the list the user clicks on
			syncr.currentList = $( this ).attr( 'id' ).substr( 9 );
			// and send it to the 'changeLists()' function
			syncr.changeLists( syncr.currentList );
		});

	},

	// rename the current list
	renameList: function () {

		var renameListName = $( '#renameInput' ).val();
		if ( renameListName !== '' ) {
			$( '.created-lists .active' ).text( renameListName );
		}

		syncr.closeModal();
		syncr.closeMenu();

	},


	///////////////////////////////
	//  item-specific functions  //
	///////////////////////////////

	// add new item
	addItem: function ( currentList ) {
		// set var to be the number of items in the current list
		syncr.numberOfListItems = $( '#' + currentList ).children().length;

		// add a new list item with an input field to enter a enw item into it
		$( '<li class="item-editing item-' +  syncr.numberOfListItems + '"><input class="editableItem" type="text" placeholder="Type new item here" autofocus /></li>' )
			.insertBefore( '#' + currentList + ' li:last' );
	},

	// presents user with a delete confirmation
	deleteItem: function () {

		// store the current item in a variable in case the user decides to undo the delete
		syncr.currentItemName = $( syncr.currentItem ).text();

		$( '.item-name' ).text( '"' + syncr.currentItemName + '"' );

		// show the delete / undo options
		$( syncr.currentItem )
			.remove();

		syncr.closeModal();
		syncr.closeMenu();
		
	},

	// edit existing item
	editItem: function ( currentItem ) {
		$( currentItem )
			.replaceWith( '<li class="item-editing ' +  $( currentItem ).attr( 'class' ) + '"><input class="editableItem" type="text" value="' + $( currentItem ).text() + '" autofocus /></li>' );
	},

	// submit the new item
	setItem: function ( e, list ) {
		// check to see if the user pressed 'enter', 'return',, 'esc', or focued out of the input.
		if ( e.which === 13 || e.keyCode === 27 || e.type === 'blur' || e.type === 'focusout' ) {

			// make sure there's a value
			if ( $( '.editableItem' ).val() !== '' ) {

				// if so, remove the input field and set the value in a normal list item
				$( '.item-editing' )
					.html( $( '.editableItem' ).val().replace(/\s{2,}/g, ' ').trim() )
					.removeClass( 'item-editing' );

				if ( e.which === 13 ) {
					syncr.addItem( list );
				}

			} else {

				// or else just remove the new blank item
				$( '.item-editing' )
					.remove();

			}
		}
	},


	////////////////////////////////
	//  modal-specific functions  //
	////////////////////////////////

	// open modal
	openModal: function ( modalClass, type ) {

		$( '.modal, .' + modalClass )
			.removeClass( 'hide' );

		if ( modalClass === 'create-modal' && type === 'welcome-text' ) {
			$( '.welcome-text' )
				.removeClass( 'hide' );
		} else if ( modalClass === 'create-modal' && ( type !== 'welcome-text' || !type ) ) {
			$( '.create-label' )
				.removeClass( 'hide' );
		}

		syncr.closeMenu();
	},

	// close modal windows
	closeModal: function () {
		$( '.modal, div[class*="-modal"], .welcome-text, .create-label' )
			.addClass( 'hide' );
		$( 'input' ).val( '' );
	}


};


$( document ).ready ( function () {

	// warm it up chris.
	syncr.initialize();

	////////////////////////
	//  menu-view events  //
	////////////////////////

	// open the menu when clicking on the menu icon
	$( '.menu-icon a' ).on( 'click', function () {
		syncr.openMenu();
	});

	// close the menu when clicking on the list view
	$( '.close-menu' ).on( 'click', function () {
		syncr.closeMenu();
	});

	// when clicking on the create button or inputs...
	$( '#createList' ).on( 'click', function () {
		syncr.openModal( 'create-modal' );
		$( '#createInput' ).focus();
	});

	// rename the current list
	$( '#renameList' ).on( 'click', function () {
		syncr.openModal( 'rename-modal' );
		$( '#renameInput' ).focus();
	});

	// clear all items of the current list
	$( '#clearList' ).on( 'click', function () {
		syncr.openModal( 'clear-modal' );
	});

	// delete the current list
	$( '#deleteList' ).on( 'click', function () {
		syncr.openModal( 'delete-list-modal' );
	});


	////////////////////////////
	//  list-specific events  //
	////////////////////////////

	// open up the 'list of lists' when the active list title is clicked
	$( 'header' ).on( 'click', '.closed li.active', function () {
		syncr.openLists();
	});


	////////////////////////////
	//  item-specific events  //
	////////////////////////////

	// when touching a list item...
	$( '.list-view' ).on( 'touchstart mousedown', '.list [class*="item-"]', function ( e ) {

		// capture the coordinates of the first touch
		syncr.touchDown = e.clientX;
		
		// when finished touching...
		$( '.list-view' ).on( 'touchend mouseup', '.list [class*="item-"]', function ( e ) {
			// capture the coordinates of the first touch
			syncr.touchUp = e.clientX;
			syncr.touchDifference = Math.abs( syncr.touchDown - syncr.touchUp );

			// capture the list item the user is touching
			syncr.currentList = '#' + $( this ).parent().attr( 'id' );
			syncr.currentItem = '#' + $( this ).parent().attr( 'id' ) + ' .' + $( this ).attr( 'class' );

			// check to see if the touch is a tap (click) or a swipe (drag), and what direction (if any) it's going
			if ( syncr.touchDown > syncr.touchUp && syncr.touchDifference >= 10 ) {
				// user is swiping to the right
				syncr.touchDirection = 'right';
				syncr.touchType = 'swipe';

				syncr.openModal( 'delete-item-modal' );

			} else if ( syncr.touchDown < syncr.touchUp && syncr.touchDifference >= 10 ) {
				// user is swiping to the left
				syncr.touchDirection = 'left';
				syncr.touchType = 'swipe';

				console.log( 'swipe left' );

			} else {
				// user is tapping, so edit the item
				syncr.touchDirection = 'none';
				syncr.touchType = 'tap';

				// edit the list item
				syncr.editItem( syncr.currentItem );
			}

		});

	});

	// add a new item when clicking on the 'new item' item
	$( '.list-view' ).on( 'click', '.list.active .add-new-item', function () {
		syncr.currentList = $( this ).parent().attr( 'id' );
		syncr.addItem( syncr.currentList );
	});

	// on keydown or blur of an input field...
	$( '.list-view' ).on( 'keydown blur', '.list input', function ( e ) {
		syncr.currentList = $( this ).parents( '.list' ).attr( 'id' );
		syncr.setItem( e, syncr.currentList );
	});


	/////////////////////////////
	//  modal-specific events  //
	/////////////////////////////

	$( '#createInput' ).on( 'keydown', function ( e ) {
		if ( e.which === 13 || e.which === 27 ) {
			syncr.createList();
		}
	});

	$( '.create-button' ).on( 'click', function () {
		syncr.createList();
	});

	$( '#renameInput' ).on( 'keydown', function ( e ) {
		if ( e.which === 13 || e.which === 27 ) {
			syncr.renameList();
		}
	});

	$( '.rename-button' ).on( 'click', function () {
		syncr.renameList();
	});

	$( '.clear-button' ).on( 'click', function () {
		syncr.clearList();
	});

	$( '.delete-list-button' ).on( 'click', function () {
		syncr.deleteList();
	});

	$( '.delete-item-button' ).on( 'click', function () {
		syncr.deleteItem();
	});

	$( '.nevermind-button' ).on( 'click', function () {
		syncr.closeModal();
	});

});