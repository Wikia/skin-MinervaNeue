( function ( M ) {
	var
		mobile = M.require( 'mobile.startup' ),
		mfExtend = mobile.mfExtend,
		View = mobile.View,
		util = mobile.util,
		Icon = mobile.Icon,
		notificationIcon = new Icon( {
			name: 'notifications',
			glyphPrefix: 'minerva'
		} );

	/**
	 * A notification button for displaying a notifications overlay
	 * @class NotificationButton
	 * @extends View
	 * @param {Object} options Configuration options
	 * @param {string} options.notificationIconClass e.g. mw-ui-icon for icon
	 * @param {boolean} options.hasUnseenNotifications whether the user has unseen notifications
	 * @param {number} options.notificationCountRaw number of unread notifications
	 * @param {string} options.title tooltip for badge
	 * @param {string} options.url to see all notifications
	 * @param {boolean} options.hasNotifications whether the user has unseen notifications
	 * @param {Function} options.onClick handler for when the badge is clicked
	 * @memberof NotificationBadge
	* @instance
	 */
	function NotificationBadge( options ) {
		var $el, $notificationAnchor,
			count = options.notificationCountRaw || 0,
			el = options.el;

		if ( el ) {
			// Learn properties based on current element
			$el = $( el );
			options.hasUnseenNotifications = $el.find( '.notification-unseen' ).length > 0;
			options.hasNotifications = options.hasUnseenNotifications;
			$notificationAnchor = $el.find( 'a' );
			options.title = $notificationAnchor.attr( 'title' );
			options.url = $notificationAnchor.attr( 'href' );
			count = Number( $el.find( 'span' ).data( 'notification-count' ) );
		}
		View.call( this,
			util.extend( {
				notificationIconClass: notificationIcon.getClassName(),
				hasNotifications: false,
				hasUnseenNotifications: false,
				notificationCountRaw: 0
			}, options, {
				isBorderBox: false
			} )
		);
		this.url = options.url;
		this.setCount( count );
		if ( options.onClick ) {
			this.$el.on( 'click', options.onClick );
		}
	}

	mfExtend( NotificationBadge, View, {
		template: mw.template.get( 'skins.minerva.notifications.badge', 'badge.hogan' ),
		/**
		 * Update the notification count
		 * @memberof NotificationBadge
		 * @instance
		 * @param {number} count
		 */
		setCount: function ( count ) {
			if ( count > 100 ) {
				count = 100;
			}
			this.options.notificationCountRaw = count;
			this.options.notificationCountString = mw.message( 'echo-badge-count',
				mw.language.convertNumber( count )
			).text();
			this.options.isNotificationCountZero = count === 0;
			this.render();
		},
		/**
		 * Marks all notifications as seen
		 *
		 * @memberof NotificationBadge
		 * @instance
		 */
		markAsSeen: function () {
			this.options.hasUnseenNotifications = false;
			this.render();
		}
	} );

	M.define( 'skins.minerva.notifications/NotificationBadge', NotificationBadge );
}( mw.mobileFrontend ) );
