interface CardProps {
    word: string;
}

const Card: React.FC<CardProps> = ({ word }) => {
    return (
        <div className="w-32 h-16 bg-zinc-900 rounded shadow-sm text-center flex justify-center items-center">
            {word}
        </div>
    );
};

export default Card;
