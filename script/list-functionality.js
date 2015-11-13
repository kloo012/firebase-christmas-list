var app = angular.module("xmasApp", ["firebase"]);

app.constant("FIREBASE_URL", "https://blazing-fire-8193.firebaseio.com/giftlist");

app.controller('xmasCtrl', function($scope, $firebaseObject, FIREBASE_URL) {
	// set a main ref and sync object for 3-way binding
	var ref = new Firebase(FIREBASE_URL);
	var syncObject = $firebaseObject(ref);

	// bind to scope
	syncObject.$bindTo($scope, "giftlist").then(function() {

	// reset the original data, mostly for testing purposes
		$scope.reset = function() {
			ref.set({
				group0: {
					name: 'Family',
					members: {
						recipient0: {
							id: '123',
							name: 'Mom',
							gift: 'Waffle Iron',
							price: '20',
							purchased: 'false'
						},
						recipient1: {
							id: '456',
							name: 'Dad',
							gift: 'Disco Ball',
							price: '50',
							purchased: 'false'
						}
					}
				},
				group1: {
					name: 'Friends',
						members: {
							recipient0: {
							id: '789',
							name: 'Megan',
							gift: 'Dancing Pants',
							price: '100',
							purchased: 'true'
						}
					}
				}
			});
		}

		// delete a group
		$scope.deleteGroup = function(index, item) {
			var currentObject = $firebaseObject(ref.child('group' + index));
			currentObject.$remove(item.id);
		}

		// delete a recipient
		$scope.deleteRecipient = function(parentIndex, index, item) {
			var currentObject = $firebaseObject(ref.child('group' + parentIndex + '/members/recipient' + index));
			currentObject.$remove(item.id);
		}

		$scope.addGroup = function(groupname) {
			ref.once("value", function(snapshot) {
				var a = snapshot.numChildren();
				ref.child('group' + a).set({
					'name': groupname
				});
			});
			// hide modal
			$('#groupModal').modal('hide');
		}

		$scope.addRecipient = function(rname, ritem, rprice, rgroup) {
			newRef = ref.toString() + "/" + rgroup + "/members";
			var groupRef = new Firebase(newRef);
			groupRef.once("value", function(snapshot) {
				var b = snapshot.numChildren();
				groupRef.child("recipient" + b).set({
					'name': rname,
					'gift': ritem,
					'price': rprice,
					'purchased': false
				});
			});

			// hide modal
			$('#recipientModal').modal('hide');
		}
	});

});