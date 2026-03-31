import {z} from 'zod';

const RatingSchema = z.object({
    score: z.number().int().min(1, 'The StarRating score must be at least 1').max(5, 'The StarRating Score must be at least 1').describe("The score of the rating"),
    scoreColor: z.string().default('#3b82f6'),
    neutralColor: z.string().default('#e5e7eb'),
    starSize: z.number().min(20, 'The minimum star size for the StarRating component is 20').default(24),
});

type RatingProps = z.infer<typeof RatingSchema>;

function StarRatingSafe(props: RatingProps) {
    const stars = [1, 2, 3, 4, 5];
    const {score, scoreColor, neutralColor, starSize} = props;
    return (
        <>
            {stars.map((star) => (
                // or "bi bi-star"
                <svg
                    key={star}
                    width={starSize}
                    height={starSize}
                    viewBox="0 0 24 24"
                    fill={star <= score ? scoreColor : neutralColor}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            ))}
        </>
    );
}

export default function StarRating(props: RatingProps) {
    let result = RatingSchema.safeParse(props);

    if (!result.success) {
        let message = result.error.issues
            .map(issue => {
                const path = issue.path.join('.');
                return `• ${path}: ${issue.message}`;
            })
            .join('\n');
        // It's a RSC component
        // console.error(message)
        let StarRatingError = StarRatingSafe({
            score: 5,
            scoreColor: 'red',
            neutralColor: "#e5e7eb",
            starSize: 24
        });
        return (
            <span title={message}>{StarRatingError}</span>
        )


    }
    return StarRatingSafe(result.data);

}