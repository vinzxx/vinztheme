// Copyright (c) 2015 - 2017 Dane Everitt <dane@daneeveritt.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
$(document).ready(function () {
    Socket.on('console', function (data) {
        if (typeof data === 'undefined' || typeof data.line === 'undefined') {
            return;
        }

        if (~data.line.indexOf('You need to agree to the EULA in order to run the server')) {
            Swal.fire({
                title: 'EULA Acceptance',
                html: 'By pressing \'I Accept\' below you are indicating your agreement to the <a href="https://account.mojang.com/documents/minecraft_eula" target="_blank">Mojang EULA</a>.',
                icon: 'info',
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: 'I do not Accept',
                confirmButtonText: 'I Accept'
            }).then(function(result) {
				if (result.value) {
					$.ajax({
						type: 'POST',
						url: Pterodactyl.meta.saveFile,
						headers: { 'X-CSRF-Token': Pterodactyl.meta.csrfToken, },
						data: {
							file: 'eula.txt',
							contents: 'eula=true'
						}
					}).done(function (data) {
						$('[data-attr="power"][data-action="start"]').trigger('click');
						swal.fire({
							icon: 'success',
							title: '',
							html: 'The EULA for this server has been accepted, restarting server now.',
						});
                	}).fail(function (jqXHR) {
						console.error(jqXHR);
						swal.fire({
							title: 'Whoops!',
							html: 'An error occurred while attempting to set the EULA as accepted: ' + jqXHR.responseJSON.error,
							icon: 'error'
						});
                	});
				}
            });
        }
    });
});
