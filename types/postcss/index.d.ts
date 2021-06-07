declare module 'postcss/lib/comment' {
	import { Comment } from 'postcss';

	interface CommentExtended extends Comment {
		// Used by the Less parser to indicate `//` comments.
		inline?: boolean;
		raws: Comment['raws'] & {
			// Used by the SCSS parser to indicate `//` comments.
			inline?: boolean;
		};
	}

	export = CommentExtended;
}
